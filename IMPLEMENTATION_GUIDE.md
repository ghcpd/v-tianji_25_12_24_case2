# Implementation Guide – Phase 1: Foundation & Architecture

**Target Duration:** 2 weeks  
**Start Date:** Week of December 27, 2025

---

## Quick Reference

### What We're Doing
Consolidate the codebase by fixing architectural issues BEFORE adding new features. This makes future work faster and clearer.

### Why This Matters
- Current code has abandoned patterns (unused hooks, duplicate types, scattered state)
- These confuse new contributors and slow down feature development
- Fixing now prevents much bigger refactoring later

### Success Criteria
By end of Phase 1:
- ✅ All state management goes through Context API
- ✅ All types imported from `src/types/index.ts`
- ✅ localStorage accessed only through StorageService
- ✅ No unused code or duplicate patterns
- ✅ App still works exactly the same, just cleaner internally

---

## Phase 1A: State Management – Detailed Tasks

**Duration:** 3-4 days  
**Owner:** Primary maintainer

### Task 1A-1: Implement TodoContext & TodoProvider

**File:** `src/store/todoStore.ts`

```typescript
import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Todo, Filter } from '@/types'
import { StorageService } from '@/lib/storage'

// Types
interface TodoState {
  todos: Todo[]
  filter: Filter
  loading: boolean
  error: string | null
}

interface TodoContextValue {
  state: TodoState
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  setPriority: (id: string, priority?: 'low' | 'medium' | 'high') => void
  setCategory: (id: string, category: string) => void
  setFilter: (filter: Filter) => void
}

// Initial state
const initialState: TodoState = {
  todos: [],
  filter: 'all',
  loading: true,
  error: null,
}

// Action types
type TodoAction =
  | { type: 'LOAD_TODOS'; payload: Todo[] }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'SET_PRIORITY'; payload: { id: string; priority?: 'low' | 'medium' | 'high' } }
  | { type: 'SET_CATEGORY'; payload: { id: string; category: string } }
  | { type: 'SET_FILTER'; payload: Filter }
  | { type: 'SET_ERROR'; payload: string | null }

// Reducer
function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'LOAD_TODOS':
      return { ...state, todos: action.payload, loading: false }
    
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] }
    
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      }
    
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      }
    
    case 'SET_PRIORITY':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, priority: action.payload.priority }
            : todo
        ),
      }
    
    case 'SET_CATEGORY':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, category: action.payload.category }
            : todo
        ),
      }
    
    case 'SET_FILTER':
      return { ...state, filter: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    default:
      return state
  }
}

// Context
export const TodoContext = createContext<TodoContextValue | undefined>(undefined)

// Provider component
interface TodoProviderProps {
  children: ReactNode
}

export function TodoProvider({ children }: TodoProviderProps) {
  const [state, dispatch] = useReducer(todoReducer, initialState)

  // Load todos from storage on mount
  useEffect(() => {
    const stored = StorageService.getTodos()
    dispatch({ type: 'LOAD_TODOS', payload: stored })
  }, [])

  // Save todos to storage whenever they change
  useEffect(() => {
    StorageService.saveTodos(state.todos)
  }, [state.todos])

  // Action creators
  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now(),
    }
    dispatch({ type: 'ADD_TODO', payload: newTodo })
  }

  const toggleTodo = (id: string) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id })
  }

  const deleteTodo = (id: string) => {
    dispatch({ type: 'DELETE_TODO', payload: id })
  }

  const setPriority = (id: string, priority?: 'low' | 'medium' | 'high') => {
    dispatch({ type: 'SET_PRIORITY', payload: { id, priority } })
  }

  const setCategory = (id: string, category: string) => {
    dispatch({ type: 'SET_CATEGORY', payload: { id, category } })
  }

  const setFilter = (filter: Filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter })
  }

  const value: TodoContextValue = {
    state,
    addTodo,
    toggleTodo,
    deleteTodo,
    setPriority,
    setCategory,
    setFilter,
  }

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
}

// Hook
export function useTodoContext() {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error('useTodoContext must be used within TodoProvider')
  }
  return context
}
```

**Checklist:**
- [ ] Copy code to `src/store/todoStore.ts`
- [ ] Verify file syntax (TypeScript checks)
- [ ] Update types imports if needed

### Task 1A-2: Update StorageService to handle Todo type

**File:** `src/lib/storage.ts`

```typescript
import { Todo } from '@/types'

export class StorageService {
  private static readonly TODOS_KEY = 'todos'

  static getTodos(): Todo[] {
    try {
      const item = localStorage.getItem(this.TODOS_KEY)
      return item ? JSON.parse(item) : []
    } catch (e) {
      console.error('Failed to load todos from storage', e)
      return []
    }
  }

  static saveTodos(todos: Todo[]): void {
    try {
      localStorage.setItem(this.TODOS_KEY, JSON.stringify(todos))
    } catch (e) {
      console.error('Failed to save todos to storage', e)
    }
  }

  static clearTodos(): void {
    try {
      localStorage.removeItem(this.TODOS_KEY)
    } catch (e) {
      console.error('Failed to clear todos', e)
    }
  }
}
```

**Checklist:**
- [ ] Update file with typed version
- [ ] Ensure error handling is in place

### Task 1A-3: Refactor App.tsx to use TodoProvider

**File:** `src/App.tsx`

Replace the entire current App.tsx with:

```typescript
import { useTodoContext } from './store/todoStore'
import TodoList from './components/TodoList'
import TodoForm from './components/TodoForm'
import FilterBar from './components/FilterBar'
import './App.css'

function AppContent() {
  const { state, addTodo, setFilter } = useTodoContext()
  const { todos, filter } = state

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  return (
    <div className="app">
      <h1>My Tasks</h1>
      <TodoForm onAdd={addTodo} />
      <FilterBar currentFilter={filter} onFilterChange={setFilter} />
      <TodoList todos={filteredTodos} />
    </div>
  )
}

import { TodoProvider } from './store/todoStore'

function App() {
  return (
    <TodoProvider>
      <AppContent />
    </TodoProvider>
  )
}

export default App
```

**Checklist:**
- [ ] Remove old useState hooks from App.tsx
- [ ] Remove old useEffect for localStorage
- [ ] Wrap return with TodoProvider at root
- [ ] Use useTodoContext hook instead of local state
- [ ] Test that app loads and saves todos correctly

---

## Phase 1B: Type Consolidation – Tasks

**Duration:** 1-2 days  
**Owner:** Any contributor

### Task 1B-1: Extend types/index.ts

**File:** `src/types/index.ts`

```typescript
/**
 * Core Todo type representing a task item
 * 
 * Future fields to support:
 * - tags: string[] (categorization)
 * - assignedTo: string (for team collaboration)
 * - dueDate: number (deadline)
 */
export interface Todo {
  id: string
  text: string
  completed: boolean
  priority?: 'low' | 'medium' | 'high'
  category?: string
  createdAt: number
  // Future fields (Phase 2+)
  // dueDate?: number | null
  // tags?: string[]
  // assignedTo?: string
}

/** Filter state for todo list display */
export type Filter = 'all' | 'active' | 'completed'

/** Priority level for todos */
export type Priority = 'low' | 'medium' | 'high'

/** User role for team collaboration (Phase 4) */
export type UserRole = 'owner' | 'member' | 'viewer'

/** Team member in collaboration feature (Phase 4) */
export interface TeamMember {
  id: string
  name: string
  email: string
  role: UserRole
}
```

**Checklist:**
- [ ] Update types/index.ts with all types above
- [ ] Add JSDoc comments
- [ ] Verify no TypeScript errors

### Task 1B-2: Update all component imports

**Files to Update:**
- `src/components/TodoForm.tsx` – Remove local Todo interface, import from types
- `src/components/TodoItem.tsx` – Remove local Todo interface, import from types
- `src/components/TodoList.tsx` – Remove local Todo interface, import from types
- `src/components/FilterBar.tsx` – Import Filter type from types
- `src/hooks/useTodos.ts` – Import Todo from types
- `src/features/collaboration/TeamMember.tsx` – Import TeamMember from types

**Example change:**
```typescript
// Before:
interface Todo {
  id: string
  text: string
  completed: boolean
}

// After:
import { Todo } from '@/types'
```

**Checklist:**
- [ ] Update all imports in components
- [ ] Delete duplicate type definitions
- [ ] Run `npm run build` to verify no TypeScript errors
- [ ] App still works correctly

---

## Phase 1C: Storage Abstraction – Tasks

**Duration:** 1 day  
**Owner:** Any contributor

### Task 1C-1: Verify StorageService integration

The TodoProvider (Task 1A-1) already uses StorageService, so this should be complete after Phase 1A.

**Verification:**
- [ ] Open dev tools → Application → Local Storage
- [ ] Create a todo
- [ ] Verify `todos` key appears in localStorage with correct JSON
- [ ] Refresh page
- [ ] Verify todos reappear (loaded from StorageService)

### Task 1C-2: Remove direct localStorage usage

Search for `localStorage` in the codebase and verify none remain in components:

```bash
grep -r "localStorage" src/components/ src/App.tsx
```

Should return: nothing (all usage should be in store/ and lib/)

**Checklist:**
- [ ] No localStorage calls in components
- [ ] No localStorage calls in App.tsx
- [ ] All persistence goes through StorageService

---

## Phase 1D: Code Cleanup – Tasks

**Duration:** 1-2 days  
**Owner:** Any contributor

### Task 1D-1: Handle unused patterns

**Decision needed for each:** Use it in refactored code, or delete it?

**Files to review:**
1. `src/hooks/useTodos.ts` – Custom hook not used
   - [ ] Option A: Delete if using context pattern
   - [ ] Option B: Keep as alternative pattern (document why)
   - **Recommendation:** Delete (context approach is preferred)

2. `src/store/todoStore.ts` (old) – Now replaced by new implementation
   - [ ] Delete after Task 1A-1 completes

3. `src/services/api.ts` – API stub
   - [ ] Keep but add comment: "Implemented in Phase 3"
   - [ ] Remove unimplemented method bodies

### Task 1D-2: Clean up TODO/FIXME comments

Remove or update comments from Phase 1 decisions:

**In src/App.tsx:**
- [ ] Remove: "TODO: Consider moving to context or state management library"
- [ ] Remove: "FIXME: This is getting messy..."
- [ ] Remove: "NOTE: There's a centralized Todo type..."
- [ ] Remove: "Decision needed: Should we import from types/index.ts..."

**In src/components/TodoForm.tsx:**
- [ ] Keep: "TODO: Add priority selection"
- [ ] Keep: "TODO: Consider adding due date input"
- [ ] (These are Phase 2 tasks)

**In all other files:**
- [ ] Update any resolved TODOs
- [ ] Keep TODOs that refer to future phases

### Task 1D-3: Code quality checks

```bash
# TypeScript check
npm run build

# Look for unused variables/imports
npm run build -- --noUnusedLocals

# Manual code review
```

**Checklist:**
- [ ] No TypeScript errors
- [ ] No ESLint warnings (if eslint configured)
- [ ] No unused imports
- [ ] No console errors on app load

---

## Verification & Testing

### After completing Phase 1A:

```bash
npm run dev
```

Test checklist:
- [ ] App loads without errors
- [ ] Can add a new todo
- [ ] Can mark todo as complete
- [ ] Can delete a todo
- [ ] Todos persist after page refresh
- [ ] Filter by "Active" shows uncompleted only
- [ ] Filter by "Completed" shows completed only
- [ ] No console errors or warnings

### After completing Phase 1B:

- [ ] `npm run build` completes without errors
- [ ] All imports use `src/types/index.ts`
- [ ] No duplicate type definitions exist
- [ ] Components type-check correctly

### After completing Phase 1C:

- [ ] No `localStorage` calls in components
- [ ] StorageService is sole persistence interface
- [ ] Todos still save and load correctly

### After completing Phase 1D:

- [ ] No unused imports or files
- [ ] All resolved TODOs/FIXMEs removed
- [ ] Code is clean and well-organized

---

## Common Patterns After Phase 1

### Adding a new action to context

When Phase 2 asks you to add a feature (like priority setting):

1. **Add to TodoAction union:**
   ```typescript
   | { type: 'SET_PRIORITY'; payload: { id: string; priority?: Priority } }
   ```

2. **Add case to reducer:**
   ```typescript
   case 'SET_PRIORITY':
     return {
       ...state,
       todos: state.todos.map(todo =>
         todo.id === action.payload.id
           ? { ...todo, priority: action.payload.priority }
           : todo
       ),
     }
   ```

3. **Add action creator to context value:**
   ```typescript
   setPriority: (id: string, priority?: Priority) => {
     dispatch({ type: 'SET_PRIORITY', payload: { id, priority } })
   }
   ```

4. **Use in component:**
   ```typescript
   const { setPriority } = useTodoContext()
   setPriority(todoId, 'high')
   ```

### Adding a new type

All types go in `src/types/index.ts`. Document future fields with JSDoc comments.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "useTodoContext must be used within TodoProvider" | Make sure <TodoProvider> wraps the component |
| localStorage key not found | Check StorageService.getTodos() handles empty case |
| Types not found | Verify imports use full path: `import { Todo } from '@/types'` |
| Stale data after refresh | Ensure useEffect in TodoProvider runs on mount |
| Build fails with TypeScript error | Run `npm run build` to see full error message |

---

## Review Checklist

Before declaring Phase 1 complete:

- [ ] All state goes through Context API
- [ ] No state in App.tsx (only uses context)
- [ ] All types imported from src/types/index.ts
- [ ] No duplicate type definitions
- [ ] All persistence through StorageService
- [ ] No localStorage in components
- [ ] No unused hooks, unused files, or dead code
- [ ] All TODOs/FIXMEs cleaned up or relevant to Phase 2+
- [ ] npm run build succeeds
- [ ] All CRUD operations work
- [ ] Data persists correctly
- [ ] Filtering works correctly
- [ ] No console errors or warnings
- [ ] Tests pass (if tests exist)

---

## Next Steps After Phase 1

Once Phase 1 is complete, the codebase is ready for:
- **Phase 2:** Add priorities, due dates, categories
- **Phase 3:** Swap StorageService for ApiService without changing components
- **Phase 4:** Add real-time sync via WebSocket (context patterns support this)

The Context API foundation makes all of these much simpler.

---

**Questions?** Refer back to ROADMAP.md (strategic overview) or ARCHITECTURE.md (decisions rationale).
