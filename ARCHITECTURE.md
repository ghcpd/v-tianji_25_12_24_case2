# Architecture Decision Records (ADRs) & Implementation Details

**Document Date:** December 24, 2025

---

## ADR-001: State Management Approach

**Status:** Proposed (To be implemented in Phase 1A)  
**Context:** Application currently uses component-level state scattered across App.tsx, with partial Context API stub and unused custom hooks.

### Decision
Adopt **React Context API** as the centralized state management solution.

### Rationale
- **Built-in:** No external dependencies required
- **Lightweight:** Suitable for current application complexity
- **Scalability:** Sufficient until 5+ contexts needed (at which point consider Redux/Zustand)
- **Learning Curve:** Developers already familiar with React fundamentals
- **Refactoring Cost:** Moderate effort, worth doing now before collaboration features

### Alternatives Considered
| Solution | Pros | Cons | Verdict |
|----------|------|------|---------|
| Redux | Mature, DevTools, middleware | Boilerplate-heavy, overkill for current scope | ❌ Rejected |
| Zustand | Lightweight, simple API | Adds dependency, smaller community | ⚠️ Keep as fallback option |
| MobX | Reactive, simple syntax | Less common in React ecosystem | ❌ Rejected |
| Recoil | Atomic state, hooks-based | Experimental, less stable | ❌ Rejected |

### Implementation Details

**TodoContext Structure:**
```typescript
interface TodoState {
  todos: Todo[]
  filter: Filter
  loading: boolean
  error: string | null
}

interface TodoContextValue {
  // State
  state: TodoState
  
  // Actions
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  setPriority: (id: string, priority: Priority) => void
  setCategory: (id: string, category: string) => void
  setDueDate: (id: string, dueDate: number) => void
  setFilter: (filter: Filter) => void
  
  // Utility
  getStats: () => { total: number; completed: number }
}
```

**Provider Pattern:**
```typescript
export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState)
  
  useEffect(() => {
    // Load from localStorage
    const stored = StorageService.get('todos')
    if (stored) dispatch({ type: 'LOAD_TODOS', payload: stored })
  }, [])
  
  useEffect(() => {
    // Save to localStorage on change
    StorageService.set('todos', state.todos)
  }, [state.todos])
  
  return (
    <TodoContext.Provider value={{ state, ...actions }}>
      {children}
    </TodoContext.Provider>
  )
}
```

### Consequences
- ✅ Centralized state management
- ✅ Easy to test with provider mocking
- ✅ Props drilling reduced significantly
- ⚠️ May need refactoring if complexity grows beyond ~5 contexts
- ⚠️ Performance optimization (useMemo) required for large todo lists

### Timeline
- Implement: Week 1 (Days 1-2)
- Refactor App.tsx: Week 1 (Days 2-3)
- Test & verify: Week 1 (Day 4)

---

## ADR-002: Type Definitions Consolidation

**Status:** Proposed  
**Context:** Todo interface defined in App.tsx, types/index.ts, and useTodos.ts causing inconsistency.

### Decision
**Single source of truth:** All types in `src/types/index.ts`, imported everywhere else.

### Implementation
```typescript
// src/types/index.ts (definitive location)
export interface Todo {
  id: string
  text: string
  completed: boolean
  priority?: 'low' | 'medium' | 'high'
  category?: string
  createdAt: number
  dueDate?: number | null
  assignedTo?: string // For future collaboration
}

export type Filter = 'all' | 'active' | 'completed'
export type Priority = 'low' | 'medium' | 'high'
export type UserRole = 'owner' | 'member' | 'viewer'

// All other files:
import { Todo, Filter, Priority } from '@/types'
```

### Refactoring Steps
1. Extend types/index.ts with all needed types
2. Remove duplicate definitions from App.tsx, useTodos.ts
3. Update all imports to use central type definitions
4. Add JSDoc comments documenting each type and future fields

### Consequences
- ✅ Single source of truth prevents drift
- ✅ Easier to evolve schema (add fields once, used everywhere)
- ✅ Type safety guaranteed across codebase
- ⚠️ Breaking changes in types require coordinated updates

---

## ADR-003: Storage Abstraction Layer

**Status:** Proposed  
**Context:** App.tsx directly uses localStorage. Need abstraction for future API integration.

### Decision
Use **StorageService** wrapper in Phase 1, replace with **ApiService** in Phase 3.

### Implementation Pattern

**Phase 1 (StorageService):**
```typescript
export class StorageService {
  private static readonly TODOS_KEY = 'todos'
  
  static getTodos(): Todo[] { /* ... */ }
  static saveTodos(todos: Todo[]): void { /* ... */ }
  static clearTodos(): void { /* ... */ }
}

// In TodoContext:
const [todos, setTodos] = useState<Todo[]>(() => StorageService.getTodos())
```

**Phase 3 (Replace with ApiService):**
```typescript
export class ApiService {
  static async getTodos(): Promise<Todo[]> { /* API call */ }
  static async createTodo(todo: Omit<Todo, 'id'>): Promise<Todo> { /* ... */ }
}

// In TodoContext:
const [todos, setTodos] = useState<Todo[]>([])
useEffect(() => {
  ApiService.getTodos().then(setTodos)
}, [])
```

### Interface Contract
```typescript
interface IDataStore {
  getTodos(): Promise<Todo[]>
  saveTodo(todo: Todo): Promise<Todo>
  updateTodo(id: string, todo: Partial<Todo>): Promise<Todo>
  deleteTodo(id: string): Promise<void>
}
```

Both StorageService and ApiService will implement this interface.

### Benefits
- ✅ Clean separation of concerns
- ✅ Easy to swap implementations
- ✅ Can mock in tests
- ✅ Enables gradual migration to API in Phase 3

---

## ADR-004: API Architecture (Phase 3)

**Status:** Proposed  
**Context:** Need to prepare for backend integration. Decide between REST and GraphQL.

### Decision
**REST API** with standard JSON responses.

### Rationale
- Simpler for team learning curve
- Standard HTTP methods map intuitively to CRUD
- Mature tooling and documentation
- Easier to cache and debug
- Sufficient for current feature complexity

### API Endpoint Design

```
GET    /api/todos              # List all todos (with filters)
GET    /api/todos/:id          # Get single todo
POST   /api/todos              # Create todo
PATCH  /api/todos/:id          # Update todo
DELETE /api/todos/:id          # Delete todo
POST   /api/todos/:id/complete # Mark complete (alternative)

GET    /api/categories         # List categories
POST   /api/categories         # Create category
DELETE /api/categories/:id     # Delete category

GET    /api/teams              # List team members
POST   /api/teams/:userId      # Add to team
DELETE /api/teams/:userId      # Remove from team
```

### Response Format
```typescript
// Success
{ data: Todo[] | Todo, status: 200 }

// Error
{ error: "Invalid request", status: 400, code: "INVALID_INPUT" }

// Paginated
{ data: Todo[], total: 100, page: 1, pageSize: 50, status: 200 }
```

### Error Handling Strategy
- Client-side validation before sending requests
- Server returns 4xx for client errors, 5xx for server errors
- Standardized error codes for client-side handling
- Retry logic for transient 5xx failures
- User-friendly error messages from server

### Authentication (Phase 4+)
```typescript
// Headers
Authorization: Bearer <jwt_token>
X-Request-ID: <uuid>
```

---

## ADR-005: Real-Time Synchronization (Phase 4)

**Status:** Proposed  
**Context:** Support for multiple users editing simultaneously. Need real-time updates.

### Decision
**WebSocket** for bi-directional real-time communication.

### Rationale
- Low latency for real-time updates
- Efficient for frequent updates
- Industry standard for collaboration tools
- Cleaner than polling for many concurrent users

### Message Protocol

```typescript
// Client → Server
{
  type: 'TODO_CREATED' | 'TODO_UPDATED' | 'TODO_DELETED'
  payload: Todo
  timestamp: number
  clientId: string
}

// Server → Client (broadcast to other users)
{
  type: 'TODO_CREATED'
  payload: Todo
  userId: string
  timestamp: number
}
```

### Conflict Resolution Strategy
For concurrent edits, use **Last-Write-Wins (LWW)** with tie-breaking by user ID.

Future evolution: Consider **Operational Transformation** or **CRDT** if needed.

```typescript
function mergeUpdate(existing: Todo, incoming: Todo): Todo {
  if (incoming.timestamp > existing.timestamp) {
    return incoming
  } else if (incoming.timestamp === existing.timestamp) {
    // Tie-breaker: use userId lexicographic comparison
    return incoming.userId > existing.userId ? incoming : existing
  }
  return existing
}
```

### Connection Management
```typescript
- Establish WebSocket on app mount
- Heartbeat every 30s to detect disconnection
- Automatic reconnection with exponential backoff
- Queue mutations while offline, sync on reconnect
- Show connection status in UI
```

---

## ADR-006: Testing Strategy (Phase 5)

**Status:** Proposed  
**Context:** No test coverage. Need comprehensive testing before production.

### Decision
**Layered testing approach:**
- Unit tests: TodoContext, hooks, utilities (Vitest)
- Integration tests: Component interactions (React Testing Library)
- E2E tests: Critical user flows (Playwright)

### Coverage Targets
- Overall: 80%+ code coverage
- Critical paths: 100% coverage
- Business logic: 90%+ coverage
- UI: 70%+ coverage (avoid brittle tests)

### Testing Libraries
```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "playwright": "^1.40.0",
    "msw": "^2.0.0"  // Mock Service Worker for API mocking
  }
}
```

### Test Categories

**Unit Tests (Vitest):**
- TodoContext reducer logic
- useTodos hook behavior
- Utility functions (filter, sort, search)
- StorageService/ApiService

**Integration Tests (RTL):**
- TodoForm submission flow
- FilterBar state changes
- TodoList rendering with dynamic data
- Error handling and recovery

**E2E Tests (Playwright):**
- Create, read, update, delete todo
- Filter and sort todos
- Multi-window synchronization (when Phase 4)
- Collaboration workflows

### Mocking Strategy
```typescript
// API mocking with MSW
const handlers = [
  rest.get('/api/todos', (req, res, ctx) => {
    return res(ctx.json({ data: mockTodos }))
  }),
]

const server = setupServer(...handlers)
```

---

## ADR-007: Component Architecture

**Status:** Proposed  
**Context:** Components should follow consistent patterns.

### Decision
**Functional components with hooks** exclusively. Standardize prop and state patterns.

### Component Pattern

```typescript
// src/components/TodoItem.tsx
import { Todo } from '@/types'
import { useTodoContext } from '@/hooks'
import './TodoItem.css'

interface TodoItemProps {
  todo: Todo
  onDelete?: (id: string) => void  // Optional for composition
}

export function TodoItem({ todo, onDelete }: TodoItemProps) {
  const { toggleTodo, deleteTodo } = useTodoContext()
  
  const handleDelete = () => {
    onDelete?.(todo.id) || deleteTodo(todo.id)
  }
  
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        aria-label={`Toggle ${todo.text}`}
      />
      <span>{todo.text}</span>
      <button onClick={handleDelete}>Delete</button>
    </div>
  )
}

export default TodoItem
```

### Best Practices
- ✅ Use TypeScript for all props
- ✅ Keep components < 300 lines (split if larger)
- ✅ Use composition over heavy props
- ✅ Memoize components only if rendering is expensive
- ✅ Use semantic HTML and ARIA labels
- ✅ Keep styles co-located with component

---

## ADR-008: Code Organization

**Status:** Proposed  
**Context:** Current structure is logical but could be more scalable.

### Recommended Structure Evolution

**Phase 1-2 (Current → Keep As-Is):**
```
src/
  components/       # Reusable UI components
  features/         # Feature-specific modules (collaboration)
  hooks/            # Custom React hooks
  services/         # API, storage, external integrations
  store/            # State management (Context)
  types/            # TypeScript type definitions
  utils/            # Helper functions
  config/           # Constants and config
  lib/              # Shared libraries and utilities
```

**Phase 3+ (Scale if needed):**
```
src/
  domains/          # Domain-driven design
    todos/
      components/
      hooks/
      services/
      types.ts
    collaboration/
      components/
      services/
      types.ts
  shared/           # Truly shared code
    components/
    hooks/
    types/
```

---

## Decision Log

| ADR | Title | Status | Impact | Owner |
|-----|-------|--------|--------|-------|
| 001 | State Management | Proposed | High | Frontend Lead |
| 002 | Type Consolidation | Proposed | High | Frontend Lead |
| 003 | Storage Abstraction | Proposed | Medium | Frontend Lead |
| 004 | REST API Design | Proposed | High | Frontend + Backend |
| 005 | WebSocket Real-Time | Proposed | High | Frontend + Backend |
| 006 | Testing Strategy | Proposed | Medium | QA + Frontend |
| 007 | Component Architecture | Proposed | Medium | Frontend Lead |
| 008 | Code Organization | Proposed | Low | Frontend Lead |

---

## Unresolved Questions & Future Discussions

1. **Database Schema** – Need to align with backend team on todo/team/collaboration models
2. **Authentication** – Which auth provider (JWT, OAuth, SSO)?
3. **Real-time Conflict Resolution** – LWW sufficient or need CRDT?
4. **Offline Support** – Full offline-first or online-first with graceful degradation?
5. **Permissions Model** – Row-level security, resource-based access control, or simpler approach?
6. **Analytics** – What events to track for product insights?
7. **Notifications** – In-app only or push notifications?
8. **Mobile** – Web-only or React Native app needed?

---

## Review Checklist

Before implementing each phase:
- [ ] All decisions in this document reviewed by team
- [ ] Implementation plan broken into 1-3 day tasks
- [ ] Code review standards agreed upon
- [ ] Testing requirements clarified
- [ ] Acceptance criteria defined for each task
- [ ] Risk mitigation plan in place
- [ ] Dependencies on other teams identified

---

**Next Step:** Schedule decision review meeting with core team.
