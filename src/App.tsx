import { useState, useEffect } from 'react'
import TodoList from './components/TodoList'
import TodoForm from './components/TodoForm'
import FilterBar from './components/FilterBar'
import './App.css'

// TODO: Consider moving to context or state management library
// FIXME: This is getting messy with multiple components accessing state
// NOTE: There's a centralized Todo type in src/types/index.ts but we're not using it
// Decision needed: Should we import from types/index.ts or keep local definitions?
interface Todo {
  id: string
  text: string
  completed: boolean
  priority?: 'low' | 'medium' | 'high'
  createdAt: number
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  // Temporary: using localStorage directly
  // Future: should use proper API or state management
  useEffect(() => {
    const stored = localStorage.getItem('todos')
    if (stored) {
      try {
        setTodos(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to load todos', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now(),
    }
    setTodos([...todos, newTodo])
  }

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Manager</h1>
        <p className="subtitle">Organize your work</p>
      </header>
      <main className="app-main">
        <TodoForm onAdd={addTodo} />
        <FilterBar currentFilter={filter} onFilterChange={setFilter} />
        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </main>
    </div>
  )
}

export default App

