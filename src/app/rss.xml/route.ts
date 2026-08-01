import { NextResponse } from 'next/server'
import { getAllBlogPosts } from '@/lib/blog'

export const dynamic = 'force-static'

export async function GET() {
  const allPosts = await getAllBlogPosts()
  const baseUrl = process.env.SITE_URL || 'https://investment.advenoh.pe.kr'

  // 이 라우트 핸들러가 out/rss.xml 을 만들면서 scripts/generateRssFeed.ts 가 쓴
  // public/rss.xml 을 가린다. 그래서 필터·정렬·개수 제한을 여기에도 똑같이 둬야 한다.
  // (stub 은 본문 없이 frontmatter 만 채운 타임라인 사건 글이다. 피드에 나가면 안 된다.)
  const posts = allPosts
    .filter(post => post.stub !== true)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20)

  const rssItems = posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/${post.categories?.[0]?.toLowerCase() || 'etc'}/${post.slug}</link>
      <guid>${baseUrl}/${post.categories?.[0]?.toLowerCase() || 'etc'}/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.categories?.map(category => `<category><![CDATA[${category}]]></category>`).join('') || ''}
      ${post.tags?.map(tag => `<category><![CDATA[${tag}]]></category>`).join('') || ''}
    </item>
  `).join('')

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
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  })
} 