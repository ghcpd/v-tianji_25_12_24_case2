// Custom hook for todo operations
// This is an alternative approach to managing todos
// Currently not used - App.tsx uses direct state management
// TODO: Decide if we should refactor to use this hook pattern

import { useState, useCallback } from 'react'

interface Todo {
  id: string
  text: string
  completed: boolean
  priority?: 'low' | 'medium' | 'high'
  createdAt: number
}

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([])

  const addTodo = useCallback((text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now(),
    }
    setTodos((prev) => [...prev, newTodo])
  }, [])

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
  }
}

// FIXME: This hook exists but App.tsx doesn't use it
// Should we refactor App.tsx to use this, or remove the hook?

