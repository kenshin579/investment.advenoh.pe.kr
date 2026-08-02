import { NextResponse } from 'next/server'
import { getAllBlogPosts } from '@/lib/blog'

export const dynamic = 'force-static'

export async function GET() {
  const allPosts = await getAllBlogPosts()
  const baseUrl = process.env.SITE_URL || 'https://investment.advenoh.pe.kr'

  // 이 라우트 핸들러가 out/rss.xml 을 만들면서 scripts/generateRssFeed.ts 가 쓴
  // public/rss.xml 을 가린다. 그래서 아래 선별 규칙을 두 곳에 똑같이 둬야 한다.
  // 한쪽만 고쳤다가 실제로 사고가 났었다. 여기를 고치면 저기도 고칠 것.
  //
  //  - stub: 본문 없이 frontmatter 만 채운 타임라인 사건 글. 피드에 나가면 안 된다.
  //  - History: 사건 14개가 모두 같은 날짜라, 두면 최신 20칸을 통째로 차지한다.
  //    이 글들의 제자리는 /timeline 이다. 홈 기본 목록에서 빼는 것과 같은 이유다.
  const posts = allPosts
    .filter(post => post.stub !== true)
    .filter(post => !post.categories?.some(c => c.toLowerCase() === 'history'))
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