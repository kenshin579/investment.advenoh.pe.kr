// Blog post interface
export interface BlogPost {
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
  views?: number;
  likes?: number;
  /**
   * 본문 없이 frontmatter 만 채운 타임라인 사건 글.
   * 홈 목록·RSS·사이트맵에서 제외하고 /timeline 에서만 노출한다.
   */
  stub?: boolean;
}

// Category interface
export interface Category {
  category: string;
  count: number;
}

// Series interface
export interface Series {
  name: string;
  posts: BlogPost[];
  totalPosts: number;
}

// Search and filter interfaces
export interface BlogFilters {
  category?: string;
  search?: string;
  tags?: string[];
  series?: string;
}

export interface BlogSearchParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Related posts interface
export interface RelatedPost extends BlogPost {
  score: number;
}

// Blog post metadata for SEO
export interface BlogPostMeta {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  twitterImage?: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  category: string;
}

// Blog post statistics
export interface BlogPostStats {
  views: number;
  likes: number;
  shares: number;
  readingTime: number;
  wordCount: number;
}

// Blog post content structure
export interface BlogPostContent {
  frontmatter: {
    title: string;
    date: string;
    author: string;
    categories: string[];
    tags: string[];
    featuredImage?: string;
    series?: string;
    seriesOrder?: number;
    excerpt?: string;
  };
  content: string;
  slug: string;
} 