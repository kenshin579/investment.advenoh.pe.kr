'use client'

import { useState } from 'react'
import { BlogPostCard } from './blog-post-card'

interface TagsPageClientProps {
  tags: Array<{ tag: string; count: number }>
}

export default function TagsPageClient({ tags }: TagsPageClientProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])

  const handleTagClick = async (tag: string) => {
    setSelectedTag(tag)

    const response = await fetch('/data/posts.json')
    const allPosts = await response.json()
    const filtered = allPosts.filter((post: any) => post.tags?.includes(tag))
    setFilteredPosts(filtered)
  }

  const getSize = (count: number) => {
    if (count >= 20) return 'text-4xl'
    if (count >= 10) return 'text-3xl'
    if (count >= 5) return 'text-2xl'
    return 'text-xl'
  }

  const getColor = (count: number) => {
    if (count >= 20) return 'text-blue-600 dark:text-blue-400'
    if (count >= 10) return 'text-green-600 dark:text-green-400'
    if (count >= 5) return 'text-orange-600 dark:text-orange-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">태그 탐색</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          태그를 클릭하여 관련 콘텐츠를 찾아보세요
        </p>
      </header>

      <div className="flex flex-wrap gap-4 justify-center items-center p-8">
        {tags.slice(0, 100).map((item) => (
          <button
            key={item.tag}
            onClick={() => handleTagClick(item.tag)}
            className={`${getSize(item.count)} ${getColor(item.count)} font-bold hover:scale-110 transition-transform cursor-pointer`}
          >
            {item.tag}
            <span className="text-sm ml-1">({item.count})</span>
          </button>
        ))}
      </div>

      {selectedTag && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">
            #{selectedTag} ({filteredPosts.length})
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
