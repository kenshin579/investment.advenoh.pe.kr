// Client-side blog utilities using API calls
import { BlogPost } from './blog-server'

// Client-side function to get all blog posts via API
export async function getAllBlogPostsClient(): Promise<BlogPost[]> {
  try {
    const response = await fetch('/api/blog-posts')
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts')
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

// Client-side function to get categories via API
export async function getAllCategoriesClient(): Promise<Array<{ category: string; count: number }>> {
  try {
    const response = await fetch('/data/categories.json')
    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

// Client-side function to get single post via API
export async function getBlogPostBySlugClient(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`/api/blog-posts/${slug}`)
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error('Failed to fetch blog post')
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

// Client-side function to search posts
export async function searchPostsClient(query: string): Promise<BlogPost[]> {
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) {
      throw new Error('Failed to search posts')
    }
    return response.json()
  } catch (error) {
    console.error('Error searching posts:', error)
    return []
  }
}

// Client-side function to get posts in series
export async function getPostsInSeriesClient(seriesName: string): Promise<BlogPost[]> {
  try {
    const response = await fetch(`/api/series/${encodeURIComponent(seriesName)}`)
    if (!response.ok) {
      throw new Error('Failed to fetch series posts')
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching series posts:', error)
    return []
  }
}