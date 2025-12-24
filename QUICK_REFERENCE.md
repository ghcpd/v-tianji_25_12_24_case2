# Quick Reference Card

**Frontend Todo Application – Developer Cheat Sheet**

---

## The Problem We're Solving

```
❌ CURRENT STATE              ✅ DESIRED STATE (after roadmap)
Scattered state              Single source of truth (Context API)
Duplicate types              Centralized types (types/index.ts)
Mixed storage patterns       Clean abstraction (StorageService → ApiService)
No collaboration             Multi-user real-time sync
No tests                     80%+ coverage, safe refactoring
No performance optimization  <150KB bundle, fast interactions
No docs                      Complete docs, easy onboarding
```

---

## The 12-Week Plan (One Sentence Each)

| Phase | Goal | Week |
|-------|------|------|
| 1 | Fix architecture (state, types, storage) | 1-2 |
| 2 | Add features (priorities, categories, filters) | 3-4 |
| 3 | Connect to backend (API layer, async state) | 5-6 |
| 4 | Enable collaboration (real-time, permissions) | 7-9 |
| 5 | Polish & optimize (tests, performance, a11y) | 10-11 |
| 6 | Document everything (guides, ADRs, runbooks) | 12 |

---

## Phase 1: The Foundation (Start Here)

### What: 4 Sub-Tasks
1. **1A: State Management** → Use Context API (not component state)
2. **1B: Types** → All from `src/types/index.ts` (no duplication)
3. **1C: Storage** → Only through StorageService (not direct localStorage)
4. **1D: Cleanup** → Remove unused code and old TODOs

### Effort: ~5 days (1 week) for 2 devs

### Success: App works exactly the same, but code is cleaner inside

### Key Files to Modify
```
src/store/todoStore.ts        (Create complete Context+Provider)
src/types/index.ts            (Extend with all types)
src/lib/storage.ts            (Update to use Todo type)
src/App.tsx                   (Remove state, use Context)
src/components/*.tsx          (Remove local Todo definitions)
```

---

## Key Decision: Context API

**Why not Redux?**
- Too much boilerplate for current scope
- Context is built-in, sufficient now

**Why not Zustand?**
- Adds external dependency
- Context gets us there for this app size

**When to reconsider?**
- If 5+ contexts needed
- If performance becomes issue with large lists

---

## Code Pattern After Phase 1

### Creating State (Use Context)

```typescript
// src/store/todoStore.ts
export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState)
  
  const addTodo = (text) => {
    dispatch({ type: 'ADD_TODO', payload: newTodo })
  }
  
  return (
    <TodoContext.Provider value={{ state, addTodo, ... }}>
      {children}
    </TodoContext.Provider>
  )
}
```

### Using State (Use Hook)

```typescript
// Any component
function MyComponent() {
  const { state, addTodo } = useTodoContext()
  
  return (
    <div>
      {state.todos.map(todo => (
        <div key={todo.id}>{todo.text}</div>
      ))}
    </div>
  )
}
```

---

## Phase 2: Features

*Preview of what comes after Phase 1*

- Add `priority` field to todos
- Add `category` field to todos
- Add `dueDate` field to todos
- Enhance FilterBar with more options
- Add search functionality

---

## Phase 3: Backend Integration

*Needed before Phase 4*

- Create `ApiService` class
- Replace `StorageService` in TodoContext
- Implement error handling and loading states
- Add mock server for development

---

## Phase 4: Collaboration

*The big phase – real-time multi-user*

- Add WebSocket support
- Track team members
- Handle concurrent edits
- Implement permissions (Owner, Member, Viewer)
- Show who's editing what

---

## Phase 5: Polish

*Before shipping to production*

- Write tests (80%+ coverage)
- Optimize performance
- Accessibility compliance (WCAG AA)
- Error monitoring
- Analytics

---

## Important Concepts

### Reducer Pattern
```typescript
// Actions are objects describing what happened
const action = { type: 'ADD_TODO', payload: newTodo }

// Reducer applies action to state and returns new state
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] }
    default:
      return state
  }
}
```

### Context Pattern
```typescript
// 1. Create context
const MyContext = createContext()

// 2. Create provider that manages state
function MyProvider({ children }) {
  const [state, dispatch] = useReducer(...)
  return <MyContext.Provider value={{state, ...}}>{children}</MyContext.Provider>
}

// 3. Use custom hook to access from anywhere
function useMyContext() {
  return useContext(MyContext)
}

// 4. Wrap app with provider
<MyProvider><App /></MyProvider>

// 5. Use in component
const { state } = useMyContext()
```

---

## Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Type check (without running)
npm run build

# Check for unused imports/variables
npm run build -- --noUnusedLocals
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "useTodoContext must be used within TodoProvider" | Make sure <TodoProvider> wraps your component |
| Types not found | Use `import { Todo } from '@/types'` |
| Data doesn't persist | Check StorageService.saveTodos is called |
| Context value is undefined | Ensure Provider is higher in tree |
| Build fails | Run `npm run build` for full error message |

---

## Documentation Map

**Start with:** ROADMAP.md (big picture)  
**Then read:** ARCHITECTURE.md (design decisions)  
**For Phase 1:** IMPLEMENTATION_GUIDE.md (step-by-step tasks)  
**For collaboration:** COORDINATION.md (how we work)  

---

## Types You'll Use

```typescript
// From src/types/index.ts
interface Todo {
  id: string
  text: string
  completed: boolean
  priority?: 'low' | 'medium' | 'high'
  category?: string
  createdAt: number
}

type Filter = 'all' | 'active' | 'completed'
```

---

## Weekly Rhythm

| Day | Activity |
|-----|----------|
| Monday 10am | Phase planning (30 min) |
| Wednesday 2pm | Cross-team sync (45 min) |
| Friday 3pm | Demo & retrospective (45 min) |
| Daily | Async: Slack updates, PR reviews |

---

## PR Checklist

Before submitting a PR:
- [ ] Describe WHAT changed and WHY (not just HOW)
- [ ] Reference GitHub issue or ROADMAP task
- [ ] Run `npm run build` locally (no errors)
- [ ] Self-review your code
- [ ] Add comments for non-obvious logic
- [ ] Update relevant documentation
- [ ] Test happy path and edge cases

---

## Getting Unstuck

**Blocked on something?**

1. Document the blocker clearly:
   - What you're trying to do
   - Why you're stuck
   - What you need (decision, info, review)

2. Create GitHub issue with details

3. Ping Frontend Lead with issue link

4. While waiting: Move to next task, don't get stuck

---

## Success Metrics

### Per Phase
- [ ] Acceptance criteria met
- [ ] Code review approved
- [ ] Manual testing passes
- [ ] No regressions
- [ ] Docs updated

### Overall (End of Project)
- [ ] 80%+ test coverage
- [ ] < 150KB bundle size
- [ ] WCAG AA accessible
- [ ] Lighthouse > 90
- [ ] Multi-user collab working
- [ ] Easy to onboard devs

---

## Vocabulary

| Term | Meaning |
|------|---------|
| **Context** | React's built-in way to pass state through tree |
| **Provider** | Component that wraps app and provides state |
| **Hook** | Function to use state/context in components |
| **Reducer** | Function that updates state based on actions |
| **Action** | Object describing what happened |
| **Dispatch** | Function to send actions to reducer |
| **CRUD** | Create, Read, Update, Delete operations |
| **API** | Interface between frontend and backend |
| **WebSocket** | Real-time two-way communication |
| **CRDT** | Conflict-free data structure for sync |
| **A11y** | Accessibility (the "11" = 11 letters between A and y) |

---

## Asking for Help

**I'm confused about Context:**
→ Read ARCHITECTURE.md ADR-001, then ask in Slack

**I don't understand why we chose X:**
→ Check ARCHITECTURE.md "Alternatives Considered" section

**What's the next task after I finish mine?**
→ Check IMPLEMENTATION_GUIDE.md or ask Frontend Lead

**I want to propose a change:**
→ Create GitHub issue with proposal, or discuss in standup

**I found a bug:**
→ Create GitHub issue with reproduction steps

---

## Keeping Momentum

✅ **Do:**
- Ask questions early (not after a week of wrong direction)
- Keep PRs small (easier to review, easier to revert if needed)
- Update docs as you code (not after)
- Celebrate wins (when phase completes)
- Help blocked teammates (pair programming is allowed)

❌ **Don't:**
- Go silent when stuck (communicate!)
- Surprise the team with huge 500-line PRs
- Skip documentation (future you will thank you)
- Try to do too much (Phase boundaries exist for a reason)
- Merge code without review (especially Phase 1+)

---

## One-Pager: Phase 1 Execution

```
┌─────────────────────────────────────────────────────────┐
│  PHASE 1: Foundation & Architecture                    │
│  Duration: Weeks 1-2 (5 effective dev days)             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ✅ 1A: Implement TodoContext & TodoProvider (2 days)  │
│         └─ Consolidate all state here                  │
│                                                         │
│  ✅ 1B: Centralize types in src/types/index.ts (1 day) │
│         └─ Update all components to import from there  │
│                                                         │
│  ✅ 1C: StorageService abstraction (1 day)              │
│         └─ All persistence through service             │
│                                                         │
│  ✅ 1D: Code cleanup (1 day)                            │
│         └─ Delete unused code, clean up TODOs          │
│                                                         │
│  🎯 SUCCESS: App works same, but architecture fixed    │
│                                                         │
│  📚 GUIDE: Read IMPLEMENTATION_GUIDE.md for details    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Contact & Escalation

**Technical Questions:** Post in #frontend-tech Slack channel  
**Blockers:** Ping @frontend-lead with GitHub issue link  
**Architecture Decisions:** @frontend-lead (within 24h response)  
**Backend Coordination:** @frontend-lead + @backend-lead  
**Timeline Concerns:** @project-manager  

---

**Print this card. Keep it handy. Reference during Phase 1.**

Last Updated: December 24, 2025
