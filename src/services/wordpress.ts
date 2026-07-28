/**
 * WordPress Service for Headless CMS Integration
 * Handles API calls to WordPress REST API for Creativos Espacios
 */

export interface WordPressPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
      media_details?: {
        width: number;
        height: number;
      };
    }>;
    'author'?: Array<{
      name: string;
      description?: string;
      avatar_urls?: Record<string, string>;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy: string;
    }>>;
  };
}

const API_BASE = '/blog-admin';

/**
 * Get the appropriate base URL depending on the environment
 */
const getBaseUrl = () => {
  // Use absolute URL during build (node)
  if (typeof window === 'undefined') {
    return 'https://creativosespacios.mx/blog-admin';
  }
  // Use relative path in the browser (works in dev, prerender and production)
  return API_BASE;
};

/**
 * Fetch with timeout and error handling
 */
async function fetchWithTimeout(endpoint: string, options: RequestInit = {}, timeout = 10000) {
  const baseUrl = getBaseUrl();
  
  // Use plain permalinks style to avoid 301 redirects or config issues
  // We use the rest_route parameter which is the most compatible way
  const url = `${baseUrl}/index.php?rest_route=${endpoint}`;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Get a list of posts with pagination support
 */
export async function getPosts(perPage = 10, page = 1): Promise<{ posts: WordPressPost[], total: number, totalPages: number }> {
  const endpoint = `/wp/v2/posts&_embed&per_page=${perPage}&page=${page}&status=publish`;
  
  try {
    const response = await fetchWithTimeout(endpoint);
    
    if (!response.ok) {
      if (response.status === 400) return { posts: [], total: 0, totalPages: 0 };
      throw new Error(`WordPress API Error: ${response.status} ${response.statusText}`);
    }
    
    const total = parseInt(response.headers.get('X-WP-Total') || '0', 10);
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);
    const posts = await response.json();
    
    return { posts, total, totalPages };
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    throw error;
  }
}

/**
 * Get all posts by iterating through all pages
 * Useful for sitemap and prerendering
 */
export async function getAllPosts(): Promise<WordPressPost[]> {
  const allPosts: WordPressPost[] = [];
  let page = 1;
  let totalPages = 1;
  
  try {
    // Fetch first page to get total pages
    const firstPage = await getPosts(100, 1);
    allPosts.push(...firstPage.posts);
    totalPages = firstPage.totalPages;
    
    // Fetch remaining pages in parallel
    if (totalPages > 1) {
      const remainingPages = [];
      for (let p = 2; p <= totalPages; p++) {
        remainingPages.push(getPosts(100, p));
      }
      
      const results = await Promise.all(remainingPages);
      results.forEach(res => allPosts.push(...res.posts));
    }
    
    return allPosts;
  } catch (error) {
    console.error('Error fetching all WordPress posts:', error);
    return allPosts; // Return what we have
  }
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  const endpoint = `/wp/v2/posts&_embed&slug=${slug}&status=publish`;
  
  try {
    const response = await fetchWithTimeout(endpoint);
    
    if (!response.ok) {
      throw new Error(`WordPress API Error: ${response.status} ${response.statusText}`);
    }
    
    const posts = await response.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error(`Error fetching WordPress post by slug (${slug}):`, error);
    throw error;
  }
}
