import { readFile, writeFile } from 'fs/promises';

interface BlogPost {
  title: string;
  slug: string;
  categories: string[];
  excerpt: string;
  tags: string[];
  date: string;
  stub?: boolean;
}

async function generateRssFeed() {
  console.log('📰 Generating RSS feed...');

  const postsData = await readFile('public/data/posts.json', 'utf-8');
  const posts: BlogPost[] = JSON.parse(postsData);

  const baseUrl = process.env.SITE_URL || 'https://investment.advenoh.pe.kr';

  // 선별 규칙은 src/app/rss.xml/route.ts 와 반드시 같아야 한다.
  // 그 라우트가 out/rss.xml 을 만들며 이 파일이 쓴 public/rss.xml 을 가리기 때문에,
  // 한쪽만 고치면 배포된 피드는 안 바뀐다. 실제로 그렇게 사고가 났었다.
  //
  //  - stub: 본문 없이 frontmatter 만 채운 타임라인 사건 글
  //  - History: 사건 14개가 모두 같은 날짜라 최신 20칸을 통째로 차지한다. 제자리는 /timeline
  const sortedPosts = posts
    .filter((post) => post.stub !== true)
    .filter((post) => !post.categories?.some((c) => c.toLowerCase() === 'history'))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20);

  const rssItems = sortedPosts.map(post => {
    const category = post.categories[0] || 'etc';
    return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/${category.toLowerCase()}/${post.slug}</link>
      <guid>${baseUrl}/${category.toLowerCase()}/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${category}</category>
      ${post.tags?.map(tag => `<category><![CDATA[${tag}]]></category>`).join('') || ''}
    </item>
  `;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>투자 인사이트 블로그</title>
    <link>${baseUrl}</link>
    <description>국내외 주식, ETF, 채권, 펀드에 대한 전문적인 투자 정보와 분석</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Investment Insights Blog</generator>
    ${rssItems}
  </channel>
</rss>`;

  await writeFile('public/rss.xml', rss, 'utf-8');
  console.log('✅ Generated: public/rss.xml');
}

generateRssFeed().catch(console.error);
