import { Metadata } from 'next'
import { getAllTagsServer } from '@/lib/blog-server'
import TagsPageClient from '@/components/tags-page-client'

export const metadata: Metadata = {
  title: '태그',
  description: '블로그의 모든 태그를 탐색하고 관심 주제의 콘텐츠를 찾아보세요.',
}

export default async function TagsPage() {
  const tags = await getAllTagsServer()

  return <TagsPageClient tags={tags} />
}
