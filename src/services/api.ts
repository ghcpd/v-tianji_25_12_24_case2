// TODO: Implement proper API service
// This is a stub for future backend integration
// Decision needed: REST API or GraphQL?

interface ApiResponse<T> {
  data: T
  status: number
}

// Temporary: Currently using localStorage
// Future: Replace with actual API calls
export class ApiService {
  // Stub methods - not implemented yet
  async getTodos(): Promise<ApiResponse<any[]>> {
    // TODO: Implement API call
    throw new Error('Not implemented')
  }

  async createTodo(todo: any): Promise<ApiResponse<any>> {
    // TODO: Implement API call
    throw new Error('Not implemented')
  }

  async updateTodo(id: string, todo: any): Promise<ApiResponse<any>> {
    // TODO: Implement API call
    throw new Error('Not implemented')
  }

  async deleteTodo(id: string): Promise<ApiResponse<void>> {
    // TODO: Implement API call
    throw new Error('Not implemented')
  }
}

// Alternative approach: Using fetch directly
// Need to decide which pattern to use
export const fetchTodos = async () => {
  // FIXME: This is just a placeholder
  return []
}

