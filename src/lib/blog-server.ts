// Server-only blog utilities - now reading from static JSON
import fs from 'fs'
import path from 'path'

import { BlogPost } from '@/types/blog';

// Read posts from generated JSON file
export async function getAllBlogPostsServer(): Promise<BlogPost[]> {
  const postsPath = path.join(process.cwd(), 'public/data/posts.json')
  const postsData = fs.readFileSync(postsPath, 'utf-8')
  const posts: BlogPost[] = JSON.parse(postsData)

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Server-only function for getting categories
export async function getAllCategoriesServer(): Promise<Array<{ category: string; count: number }>> {
  const categoriesPath = path.join(process.cwd(), 'public/data/categories.json')
  const categoriesData = fs.readFileSync(categoriesPath, 'utf-8')
  const categories: Array<{ category: string; count: number }> = JSON.parse(categoriesData)

  return categories
}

// Server-only function for getting single post
export async function getBlogPostBySlugServer(slug: string): Promise<BlogPost | null> {
  const posts = await getAllBlogPostsServer()
  return posts.find(post => post.slug === slug) || null
}

// Server-only function for getting posts in series
export async function getPostsInSeriesServer(seriesName: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPostsServer()
  return posts
    .filter(post => post.series === seriesName)
    .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0))
}

// Get all series data
export async function getAllSeriesServer() {
  const seriesPath = path.join(process.cwd(), 'public/data/series.json')
  const seriesData = fs.readFileSync(seriesPath, 'utf-8')
  return JSON.parse(seriesData)
}

// Get all tags data
export async function getAllTagsServer(): Promise<Array<{ tag: string; count: number }>> {
  const tagsPath = path.join(process.cwd(), 'public/data/tags.json')
  const tagsData = fs.readFileSync(tagsPath, 'utf-8')
  const tags: Array<{ tag: string; count: number }> = JSON.parse(tagsData)

  return tags.sort((a, b) => b.count - a.count)
}

// Get posts by tag
export async function getPostsByTagServer(tagName: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPostsServer()
  return posts.filter(post => post.tags && post.tags.includes(tagName))
}