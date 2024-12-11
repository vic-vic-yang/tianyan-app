import { RequestConfig } from "./api";

export class RequestQueue {
  private queue: Map<string, Promise<any>> = new Map();

  getRequestKey(url: string, config: RequestConfig): string {
    return `${config.method || 'GET'}-${url}-${JSON.stringify(config.body || '')}`;
  }

  add(key: string, promise: Promise<any>) {
    this.queue.set(key, promise);
    return promise.finally(() => {
      this.queue.delete(key);
    });
  }

  has(key: string): boolean {
    return this.queue.has(key);
  }

  get(key: string): Promise<any> | undefined {
    return this.queue.get(key);
  }
} 
