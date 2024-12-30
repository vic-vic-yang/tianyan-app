import { CacheItem } from './api';

export class CacheManager {
  private cache: Map<string, CacheItem> = new Map();
  
  set(key: string, data: any, cacheTime: number) {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + cacheTime,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.timestamp) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear() {
    this.cache.clear();
  }
} 
