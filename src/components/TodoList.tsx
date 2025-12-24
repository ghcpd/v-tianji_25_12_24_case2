import TodoItem from './TodoItem'
import './TodoList.css'

interface Todo {
  id: string
  text: string
  completed: boolean
  priority?: 'low' | 'medium' | 'high'
  createdAt: number
}

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

// TODO: Add sorting options (by date, priority, etc.)
// NOTE: Sorting functions exist in src/utils/helpers.ts but not used here
// FIXME: Empty state could be better
function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return <div className="todo-list-empty">No tasks yet</div>
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

export default TodoList

