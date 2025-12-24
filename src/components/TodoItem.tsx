import { Component } from 'react'
import './TodoItem.css'

interface Todo {
  id: string
  text: string
  completed: boolean
  priority?: 'low' | 'medium' | 'high'
  createdAt: number
}

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

// Using class component here - different pattern from TodoForm
// Should we standardize on hooks or classes? Need to decide
class TodoItem extends Component<TodoItemProps> {
  handleToggle = () => {
    this.props.onToggle(this.props.todo.id)
  }

  handleDelete = () => {
    this.props.onDelete(this.props.todo.id)
  }

  render() {
    const { todo } = this.props
    return (
      <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={this.handleToggle}
          className="todo-checkbox"
        />
        <span className="todo-text">{todo.text}</span>
        {/* TODO: Priority display is partially implemented but not used */}
        {todo.priority && (
          <span className={`todo-priority priority-${todo.priority}`}>
            {todo.priority}
          </span>
        )}
        <button
          onClick={this.handleDelete}
          className="todo-delete-btn"
          aria-label="Delete task"
        >
          ×
        </button>
      </li>
    )
  }
}

export default TodoItem

