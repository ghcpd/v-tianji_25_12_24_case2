// Centralized type definitions
// TODO: Some types are duplicated in component files
// Should we consolidate all types here or keep them local?

export interface Todo {
  id: string
  text: string
  completed: boolean
  priority?: 'low' | 'medium' | 'high'
  createdAt: number
  // TODO: Future fields that might be added:
  // dueDate?: number
  // tags?: string[]
  // assignedTo?: string
}

export type Filter = 'all' | 'active' | 'completed'

// FIXME: This type is defined but Todo interface in App.tsx doesn't use it
// Should we refactor to use this centralized type?

