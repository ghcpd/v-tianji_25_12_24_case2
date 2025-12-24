// Utility functions
// Some are used, some are prepared for future features

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString()
}

export const formatDateTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString()
}

// TODO: This might be useful for sorting, but not implemented yet
export const sortByDate = <T extends { createdAt: number }>(items: T[]): T[] => {
  return [...items].sort((a, b) => b.createdAt - a.createdAt)
}

// TODO: Priority sorting - not used anywhere yet
export const sortByPriority = <T extends { priority?: string }>(items: T[]): T[] => {
  const priorityOrder: Record<string, number> = {
    high: 3,
    medium: 2,
    low: 1,
  }
  return [...items].sort((a, b) => {
    const aPriority = priorityOrder[a.priority || 'low'] || 0
    const bPriority = priorityOrder[b.priority || 'low'] || 0
    return bPriority - aPriority
  })
}

// FIXME: Debounce function exists but not used
// Should we use it for search/filter or remove it?
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

