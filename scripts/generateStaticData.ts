import { readFile, readdir, stat, writeFile, mkdir, copyFile } from 'fs/promises';
import { join } from 'path';
import { buildEvent, type EventFrontMatter, type TimelineEvent } from './lib/timeline/buildEvents';
import type { SeriesFile } from './lib/timeline/types';

interface MarkdownFrontMatter {
  title: string;
  description?: string;
  date: string;
  update?: string;
  category?: string;
  tags?: string[];
  series?: string;
  event?: EventFrontMatter;
  stub?: boolean;
}

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  formattedDate: string;
  author: string;
  categories: string[];
  tags: string[];
  featuredImage?: string;
  readingTime: number;
  series?: string;
  seriesOrder?: number;
  views: number;
  likes: number;
  event?: EventFrontMatter;
  stub?: boolean;
}

interface CategoryData {
  category: string;
  count: number;
}

interface SeriesData {
  name: string;
  count: number;
  latestDate: string;
  posts: {
    title: string;
    slug: string;
    date: string;
  }[];
}

/**
 * frontmatter 안에서 한 단계 중첩된 객체 블록(예: `event:` 아래 kind/peak/trough/...)을 뽑아낸다.
 *
 * 기존 파서는 최상위 스칼라 값과 `- ` 배열만 다루므로, 중첩 객체를 그대로 넘기면
 * 하위 키(kind, peak, ...)가 최상위로 새어나가고 event 자체는 빈 배열이 된다.
 * 그래서 중첩 블록을 먼저 떼어내 별도로 파싱하고, 남은 텍스트만 기존 파서에 넘긴다.
 */
function extractNestedBlock(
  frontMatterText: string,
  key: string,
): { value: Record<string, unknown> | undefined; rest: string } {
  const lines = frontMatterText.split('\n');
  const startIndex = lines.findIndex((line) => line.trim() === `${key}:`);

  if (startIndex === -1) {
    return { value: undefined, rest: frontMatterText };
  }

  let endIndex = startIndex + 1;
  while (endIndex < lines.length && /^\s+\S/.test(lines[endIndex])) {
    endIndex++;
  }

  const value: Record<string, unknown> = {};
  for (const line of lines.slice(startIndex + 1, endIndex)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    if (!trimmed.includes(':')) continue;

    const colonIndex = trimmed.indexOf(':');
    const subKey = trimmed.substring(0, colonIndex).trim();
    let subValue = trimmed.substring(colonIndex + 1).trim();

    // 인라인 주석 제거 (예: "headlineDrawdown: -33.9   # 일간 종가 ...")
    const commentIndex = subValue.indexOf('#');
    if (commentIndex !== -1) subValue = subValue.slice(0, commentIndex).trim();
    subValue = subValue.replace(/^["']|["']$/g, '');

    if (subValue === '') continue;
    value[subKey] = /^-?\d+(\.\d+)?$/.test(subValue) ? Number(subValue) : subValue;
  }

  const rest = [...lines.slice(0, startIndex), ...lines.slice(endIndex)].join('\n');
  return { value, rest };
}

function parseMarkdownFile(content: string): { frontMatter: MarkdownFrontMatter; content: string } {
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!frontMatterMatch) {
    throw new Error('No front matter found in markdown file');
  }

  const rawFrontMatterText = frontMatterMatch[1];
  const markdownContent = frontMatterMatch[2];

  // event: 는 중첩 객체라 기존의 평면 파서로는 다룰 수 없다. 먼저 떼어낸다.
  const { value: event, rest: frontMatterText } = extractNestedBlock(rawFrontMatterText, 'event');

  const frontMatter: any = {};
  const lines = frontMatterText.split('\n');
  let currentKey = '';
  let inArray = false;
  let arrayItems: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('- ')) {
      if (inArray) {
        arrayItems.push(trimmed.substring(2));
      }
    } else if (trimmed.includes(':')) {
      if (inArray && currentKey) {
        frontMatter[currentKey] = arrayItems;
        inArray = false;
        arrayItems = [];
      }

      const colonIndex = trimmed.indexOf(':');
      const key = trimmed.substring(0, colonIndex).trim();
      const value = trimmed.substring(colonIndex + 1).trim();

      currentKey = key;

      if (value === '') {
        inArray = true;
        arrayItems = [];
      } else {
        frontMatter[key] = value.replace(/^["']|["']$/g, '');
      }
    }
  }

  if (inArray && currentKey) {
    frontMatter[currentKey] = arrayItems;
  }

  if (event !== undefined) {
    frontMatter.event = event;
  }

  // 기존 파서는 모든 스칼라 값을 문자열로 남긴다. stub은 boolean이어야 한다.
  if (frontMatter.stub === 'true') frontMatter.stub = true;
  else if (frontMatter.stub === 'false') frontMatter.stub = false;

  return {
    frontMatter: frontMatter as MarkdownFrontMatter,
    content: markdownContent.trim()
  };
}

function createSlug(folderName: string): string {
  return folderName;
}

function extractExcerpt(content: string): string {
  const plainText = content
    .replace(/^#+ .+$/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();

  return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
}

function extractFirstImageFromMarkdown(content: string): string | null {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imageRegex);

  if (match && match[1]) {
    const imageSrc = match[1].trim();
    if (imageSrc.startsWith('http')) {
      return imageSrc;
    }
    return imageSrc;
  }

  return null;
}

async function importMarkdownFiles(contentDir: string = 'contents'): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];

  try {
    const categories = await readdir(contentDir);

    for (const category of categories) {
      const categoryDir = join(contentDir, category);
      const categoryStat = await stat(categoryDir);

      if (!categoryStat.isDirectory()) {
        continue;
      }

      const folders = await readdir(categoryDir);

      for (const folder of folders) {
        const folderPath = join(categoryDir, folder);
        const folderStat = await stat(folderPath);

        if (folderStat.isDirectory()) {
          const markdownPath = join(folderPath, 'index.md');

          try {
            const content = await readFile(markdownPath, 'utf-8');
            const { frontMatter, content: markdownContent } = parseMarkdownFile(content);

            const slug = createSlug(folder);
            const excerpt = extractExcerpt(markdownContent);
            const firstImage = extractFirstImageFromMarkdown(markdownContent);

            const finalCategory = frontMatter.category || category;

            let featuredImagePath = null;
            if (firstImage && !firstImage.startsWith('http')) {
              featuredImagePath = `/contents/${category}/${folder}/${firstImage}`;
            } else if (firstImage) {
              featuredImagePath = firstImage;
            }

            // Calculate reading time
            const wordsPerMinute = 200;
            const wordCount = markdownContent.split(/\s+/).length;
            const readingTime = Math.ceil(wordCount / wordsPerMinute);

            // Format date
            const formattedDate = new Date(frontMatter.date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            const blogPost: BlogPost = {
              slug,
              title: frontMatter.title,
              excerpt,
              content: markdownContent,
              date: frontMatter.date,
              formattedDate,
              author: 'Frank Oh',
              categories: [finalCategory],
              tags: frontMatter.tags || [],
              featuredImage: featuredImagePath || undefined,
              readingTime,
              series: frontMatter.series,
              seriesOrder: undefined,
              views: 0,
              likes: 0,
              event: frontMatter.event,
              stub: frontMatter.stub === true,
            };

            posts.push(blogPost);
            console.log(`✓ Imported: ${frontMatter.title}`);

          } catch (error) {
            console.error(`Failed to import ${folder}:`, error);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error importing markdown files:', error);
  }

  return posts;
}

function generateCategories(posts: BlogPost[]): CategoryData[] {
  const categoryCount: { [key: string]: number } = {};

  posts.forEach(post => {
    post.categories.forEach(category => {
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
  });

  return Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }));
}

function generateSeries(posts: BlogPost[]): SeriesData[] {
  const seriesPosts = posts.filter(post => post.series);

  const seriesMap = new Map<string, BlogPost[]>();
  seriesPosts.forEach(post => {
    if (!seriesMap.has(post.series!)) {
      seriesMap.set(post.series!, []);
    }
    seriesMap.get(post.series!)!.push(post);
  });

  return Array.from(seriesMap.entries()).map(([seriesName, seriesPosts]) => {
    const sortedPosts = seriesPosts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      name: seriesName,
      count: seriesPosts.length,
      latestDate: sortedPosts[0].date,
      posts: sortedPosts.map(post => ({
        title: post.title,
        slug: post.slug,
        date: post.date
      }))
    };
  });
}

function generateTags(posts: BlogPost[]): { tag: string; count: number }[] {
  const tagCount: { [key: string]: number } = {};

  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }));
}

async function copyImages(contentDir: string = 'contents'): Promise<void> {
  console.log('\n📸 Copying images from contents/ to public/contents/...\n');

  const imageExtensions = /\.(png|jpe?g|gif|webp|svg|ico)$/i;
  let totalImagesCopied = 0;

  try {
    const categories = await readdir(contentDir);

    for (const category of categories) {
      const categoryDir = join(contentDir, category);
      const categoryStat = await stat(categoryDir);

      if (!categoryStat.isDirectory()) {
        continue;
      }

      const folders = await readdir(categoryDir);

      for (const folder of folders) {
        const folderPath = join(categoryDir, folder);
        const folderStat = await stat(folderPath);

        if (folderStat.isDirectory()) {
          const files = await readdir(folderPath);
          const imageFiles = files.filter(file => imageExtensions.test(file));

          if (imageFiles.length > 0) {
            const targetDir = join('public', 'contents', category, folder);
            await mkdir(targetDir, { recursive: true });

            for (const imageFile of imageFiles) {
              const sourcePath = join(folderPath, imageFile);
              const targetPath = join(targetDir, imageFile);

              await copyFile(sourcePath, targetPath);
              totalImagesCopied++;
            }

            console.log(`  ✓ Copied ${imageFiles.length} image(s) from ${category}/${folder}`);
          }
        }
      }
    }

    console.log(`\n✅ Total images copied: ${totalImagesCopied}`);
  } catch (error) {
    console.error('Error copying images:', error);
    throw error;
  }
}

/**
 * contents/history/ 의 frontmatter와 data/timeline/series.json 을 결합해
 * public/data/timeline.json 을 만든다.
 */
async function generateTimeline(posts: BlogPost[]): Promise<void> {
  const raw = await readFile(join('data', 'timeline', 'series.json'), 'utf-8');
  const seriesFile = JSON.parse(raw) as SeriesFile;

  const events: TimelineEvent[] = posts
    .filter((post) => post.event !== undefined)
    .map((post) =>
      buildEvent(
        post.slug,
        post.title,
        post.event as EventFrontMatter,
        post.stub === true,
        seriesFile,
      ),
    )
    .sort((a, b) => (a.markerAt < b.markerAt ? -1 : 1));

  await writeFile(
    join('public', 'data', 'timeline.json'),
    `${JSON.stringify({ events }, null, 2)}\n`,
    'utf-8',
  );
  await writeFile(
    join('public', 'data', 'timeline-series.json'),
    `${JSON.stringify(seriesFile)}\n`,
    'utf-8',
  );

  console.log(`timeline.json 생성: 사건 ${events.length}개`);
}

async function main() {
  console.log('🚀 Starting static data generation...\n');

  // Step 1: Copy images from contents/ to public/contents/
  await copyImages();

  // Step 2: Generate JSON data
  const posts = await importMarkdownFiles();
  const categories = generateCategories(posts);
  const series = generateSeries(posts);
  const tags = generateTags(posts);

  console.log(`\n📊 Generated data:`);
  console.log(`  - Posts: ${posts.length}`);
  console.log(`  - Categories: ${categories.length}`);
  console.log(`  - Series: ${series.length}`);
  console.log(`  - Tags: ${tags.length}`);

  await mkdir('public/data', { recursive: true });

  await writeFile(
    'public/data/posts.json',
    JSON.stringify(posts, null, 2),
    'utf-8'
  );
  console.log('\n✅ Generated: public/data/posts.json');

  await generateTimeline(posts);

  await writeFile(
    'public/data/categories.json',
    JSON.stringify(categories, null, 2),
    'utf-8'
  );
  console.log('✅ Generated: public/data/categories.json');

  await writeFile(
    'public/data/series.json',
    JSON.stringify(series, null, 2),
    'utf-8'
  );
  console.log('✅ Generated: public/data/series.json');

  await writeFile(
    'public/data/tags.json',
    JSON.stringify(tags, null, 2),
    'utf-8'
  );
  console.log('✅ Generated: public/data/tags.json');

  console.log('\n🎉 Static data generation complete!');
}

main().catch(console.error);
