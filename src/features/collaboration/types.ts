// Types for collaboration features
// Not fully integrated yet

export interface Team {
  id: string
  name: string
  members: TeamMember[]
  createdAt: number
}

export interface TeamMember {
  id: string
  userId: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  joinedAt: number
}

export interface SharedTodo {
  todoId: string
  teamId: string
  permissions: {
    canEdit: boolean
    canDelete: boolean
    canAssign: boolean
  }
}

// FIXME: These types are defined but not used anywhere
// Should we implement this feature or remove the types?

