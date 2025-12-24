// Configuration constants
// TODO: Some of these might be better as environment variables
// FIXME: Hard-coded values - should we use a config file?

export const STORAGE_KEY = 'todos'

// TODO: Decide on default filter behavior
export const DEFAULT_FILTER = 'all' as const

// Temporary: Max todos limit (not enforced yet)
// Should we add this limit or remove it?
export const MAX_TODOS = 1000

// TODO: Theme configuration - not implemented
export const THEME = {
  primary: '#4CAF50',
  secondary: '#45a049',
  // ... more theme values would go here
}

// FIXME: API endpoint - currently not used (using localStorage)
// When we switch to API, need to decide on base URL
export const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000/api'

