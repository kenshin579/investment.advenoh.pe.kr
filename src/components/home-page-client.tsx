'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { BlogPost } from '@/types/blog'
import { Hero } from './hero'
import { BlogPostCard } from './blog-post-card'
import { CategoryFilterClient } from './category-filter-client'
import { TagCloudSection } from './tag-cloud-section'
import { LoadMoreButton } from './load-more-button'

interface HomePageClientProps {
  posts: BlogPost[]
  categories: Array<{ category: string; count: number }>
}

export function HomePageClient({ posts, categories }: HomePageClientProps) {
  const searchParams = useSearchParams()

  // URL 파라미터
  const selectedCategory = searchParams.get('category') || 'all'
  const searchTerm = searchParams.get('search') || ''
  const selectedTags = searchParams.get('tags') ? [searchParams.get('tags')!] : []
  const currentPage = parseInt(searchParams.get('page') || '1')
  const postsPerPage = 9

  // 필터링 및 정렬 로직 (useMemo로 최적화)
  const sortedPosts = useMemo(() => {
    // 본문 없는 타임라인 사건 글(stub)은 어디서도 보여주지 않는다.
    let filteredPosts = posts.filter(post => post.stub !== true)

    // History 는 사건 14개가 모두 같은 날짜라, 기본 목록에 두면 최신 글 9칸을 통째로 차지한다.
    // 이 글들의 제자리는 /timeline 이므로 기본 목록에서만 뺀다.
    // 사용자가 카테고리·검색·태그로 명시적으로 찾을 때는 그대로 나온다.
    const isDefaultListing =
      selectedCategory === 'all' && !searchTerm && selectedTags.length === 0
    if (isDefaultListing) {
      filteredPosts = filteredPosts.filter(
        post => !post.categories.some(c => c.toLowerCase() === 'history')
      )
    }

    // 카테고리 필터링
    if (selectedCategory !== 'all') {
      const selectedLower = selectedCategory.toLowerCase()
      filteredPosts = filteredPosts.filter(post =>
        post.categories.some(c => c.toLowerCase() === selectedLower)
      )
    }

    // 검색 필터링
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower) ||
        post.content?.toLowerCase().includes(searchLower)
      )
    }

    // 태그 필터링
    if (selectedTags.length > 0) {
      filteredPosts = filteredPosts.filter(post =>
        selectedTags.some(tag => post.tags.includes(tag))
      )
    }

    // 날짜순 정렬
    return filteredPosts.sort((a, b) => {
      const dateA = new Date(a.date || 0)
      const dateB = new Date(b.date || 0)
      return dateB.getTime() - dateA.getTime()
    })
  }, [posts, selectedCategory, searchTerm, selectedTags])

  // 페이지네이션 (useMemo로 최적화)
  const { paginatedPosts, hasMore } = useMemo(() => {
    const paginated = sortedPosts.slice(0, currentPage * postsPerPage)
    const more = sortedPosts.length > currentPage * postsPerPage
    return { paginatedPosts: paginated, hasMore: more }
  }, [sortedPosts, currentPage, postsPerPage])

  return (
    <>
      <Hero />

      {/* Category Filter */}
      <CategoryFilterClient
        categories={categories}
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
        selectedTags={selectedTags}
      />

      {/* Main Content */}
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-center">
              {searchTerm ? `"${searchTerm}" 검색 결과` :
               selectedTags.length > 0 ? `"${selectedTags[0]}" 태그 글` :
               '최신 투자 인사이트'}
            </h2>
            {(searchTerm || selectedTags.length > 0) && (
              <p className="text-muted-foreground">
                {sortedPosts.length}개의 글을 찾았습니다
              </p>
            )}
          </div>

          {sortedPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {searchTerm ? '검색 결과가 없습니다.' :
                 selectedTags.length > 0 ? '해당 태그의 글이 없습니다.' :
                 '아직 게시된 글이 없습니다.'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedPosts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} />
                ))}
              </div>

              <LoadMoreButton
                currentPage={currentPage}
                hasMore={hasMore}
                selectedCategory={selectedCategory}
                searchTerm={searchTerm}
                selectedTags={selectedTags}
              />
            </>
          )}
        </div>
      </main>

      {/* Tag Cloud Section */}
      <TagCloudSection posts={posts} />
    </>
  )
}
