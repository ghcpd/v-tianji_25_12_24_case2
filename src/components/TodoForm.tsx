import { useState, FormEvent } from 'react'
import './TodoForm.css'

interface TodoFormProps {
  onAdd: (text: string) => void
}

// Using functional component with hooks
// Note: Some components use class components, we should standardize
// TODO: Add priority selection (UI exists in TodoItem but no way to set it)
// TODO: Consider adding due date input
function TodoForm({ onAdd }: TodoFormProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onAdd(input.trim())
      setInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new task..."
        className="todo-input"
      />
      <button type="submit" className="todo-submit-btn">
        Add
      </button>
    </form>
  )
}

export default TodoForm

