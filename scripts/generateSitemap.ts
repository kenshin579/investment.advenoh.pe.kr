import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

interface BlogPost {
  title: string;
  slug: string;
  categories: string[];
  date: string;
  stub?: boolean;
}

function determineChangefreq(url: string): string {
  const baseUrl = process.env.SITE_URL || 'https://investment.advenoh.pe.kr';

  // 홈페이지
  if (url === baseUrl) {
    return 'daily';
  }

  // Weekly 카테고리
  if (url.includes('/weekly/')) {
    return 'weekly';
  }

  // 기타 모든 페이지
  return 'monthly';
}

async function generateSitemap() {
  console.log('🗺️  Generating sitemap.xml...');

  const postsData = await readFile('public/data/posts.json', 'utf-8');
  const posts: BlogPost[] = JSON.parse(postsData);

  const baseUrl = process.env.SITE_URL || 'https://investment.advenoh.pe.kr';

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const staticPages = [
    { url: baseUrl, changefreq: determineChangefreq(baseUrl), priority: '1.0' },
    { url: `${baseUrl}/series`, changefreq: determineChangefreq(`${baseUrl}/series`), priority: '0.7' },
    { url: `${baseUrl}/timeline`, changefreq: determineChangefreq(`${baseUrl}/timeline`), priority: '0.8' },
  ];

  const postUrls = posts
    .filter((post) => post.stub !== true)
    .map(post => {
    const postDate = new Date(post.date);
    const isRecent = postDate > thirtyDaysAgo;
    const category = post.categories[0] || 'etc';
    const postUrl = `${baseUrl}/${category.toLowerCase()}/${post.slug}`;

    return {
      url: postUrl,
      changefreq: determineChangefreq(postUrl),
      priority: isRecent ? '0.9' : '0.8',
      lastmod: post.date
    };
  });

  const allUrls = [...staticPages, ...postUrls];

  const urlEntries = allUrls.map(page => `
    <url>
      <loc>${page.url}</loc>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
      ${'lastmod' in page && page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    </url>
  `).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlEntries}
</urlset>`;

  await writeFile('public/sitemap.xml', sitemap, 'utf-8');
  console.log('✅ Generated: public/sitemap.xml');
}

generateSitemap().catch(console.error);
