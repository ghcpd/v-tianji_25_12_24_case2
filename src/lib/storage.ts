// Alternative storage implementation
// This is another approach to localStorage management
// Currently not used - App.tsx uses localStorage directly
// TODO: Decide if we should use this abstraction or keep direct localStorage

export class StorageService {
  private key: string

  constructor(key: string) {
    this.key = key
  }

  get<T>(): T | null {
    try {
      const item = localStorage.getItem(this.key)
      return item ? JSON.parse(item) : null
    } catch (e) {
      console.error('Storage get error', e)
      return null
    }
  }

  set<T>(value: T): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(value))
    } catch (e) {
      console.error('Storage set error', e)
    }
  }

  remove(): void {
    localStorage.removeItem(this.key)
  }
}

// FIXME: This service exists but App.tsx doesn't use it
// Should we refactor App.tsx to use this, or remove this file?

