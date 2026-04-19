import { cache } from 'react';

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Create a cache instance for API responses
const apiCache = new Map<string, { data: any; timestamp: number }>();

// Cache cleanup function
function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of apiCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      apiCache.delete(key);
    }
  }
}

// Set up periodic cache cleanup
setInterval(cleanupCache, 60000); // Clean every minute

// Base API configuration
const API_CONFIG = {
  baseUrl: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept-Version': 'v1'
  }
};

// Generic fetch function with error handling and caching
async function fetchWithCache<T>(url: string, options: RequestInit = {}): Promise<T> {
  const cacheKey = `${url}:${JSON.stringify(options)}`;
  const cached = apiCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${url}`, {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache the response
    apiCache.set(cacheKey, { data, timestamp: Date.now() });
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// API methods with proper typing
export const api = {
  // Hero section data
  getHero: cache(async () => {
    return fetchWithCache<HeroResponse>('/hero');
  }),

  // About section data
  getAbout: cache(async () => {
    return fetchWithCache<AboutResponse>('/about');
  }),

  // Projects data with pagination
  getProjects: cache(async (page = 1, limit = 20, cursor?: string) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (cursor) params.append('cursor', cursor);
    
    return fetchWithCache<PaginatedResponse<Project>>('/projects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }),

  // Contact form submission
  submitContact: async (data: ContactFormData) => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }

    return response.json();
  }
};

// TypeScript interfaces for type safety
interface HeroResponse {
  id: string;
  name: string;
  role: string;
  tagline: string;
  updatedAt: string;
  version: number;
  _meta?: {
    fetchedAt: string;
    source: string;
  };
}

interface AboutResponse {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  version: number;
  _meta?: {
    fetchedAt: string;
    source: string;
  };
}

interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse<T> {
  data: T[];
  next_cursor: string | null;
  has_more: boolean;
  total: number;
  page: number;
  limit: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  'bot-field'?: string;
}