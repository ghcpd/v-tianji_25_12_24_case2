# Development Coordination Guide

**Purpose:** Align team efforts, track progress, coordinate across contributors  
**Updated:** December 24, 2025

---

## Team Roles & Responsibilities

### Core Team

| Role | Responsibilities | Examples |
|------|------------------|----------|
| **Frontend Lead** | Oversee architecture, make technical decisions, code reviews | ADR approval, phase gate decisions |
| **Frontend Dev 1** | Implement Phase 1A-C (foundation work) | State management, type consolidation |
| **Frontend Dev 2** | Implement Phase 2 features | Priority system, categories, filtering |
| **QA / Tester** | Verify each phase, write test spec | Test matrices, edge case discovery |
| **Backend Lead** | Align API design, coordinate Phase 3-4 | REST endpoints, WebSocket protocol |

### Contributor Path for New Team Members

1. **Onboarding:** Read README.md, ROADMAP.md, ARCHITECTURE.md
2. **First Contribution:** Pick a Phase 1D cleanup task (low risk, high visibility)
3. **Second Contribution:** Assist with Phase 2 feature (work alongside existing dev)
4. **Ongoing:** Self-assign tasks from roadmap, post PRs for review

---

## Phase Gates & Approval Process

Before moving to next phase, conduct **Phase Completion Review:**

### Review Checklist
- [ ] All acceptance criteria met (see phase definition in ROADMAP.md)
- [ ] Code review completed and approved
- [ ] Manual testing done (happy path + edge cases)
- [ ] No regressions from previous phases
- [ ] Documentation updated
- [ ] Team alignment on findings/changes

### Sign-Off
- **Phase 1:** Frontend Lead + Backend Lead (API design alignment)
- **Phase 2:** Frontend Lead + Product (feature validation)
- **Phase 3:** Frontend Lead + Backend Lead (API integration)
- **Phase 4:** Frontend Lead + Backend Lead + QA (real-time testing complexity)
- **Phase 5:** Frontend Lead + QA (quality bar reached)

### Escalation Path
If phase completion blockers found:
1. Document blocker in GitHub issue
2. Notify Frontend Lead
3. Adjust timeline if needed OR move item to future phase
4. Update ROADMAP.md with new dates

---

## Weekly Sync Structure

### Monday 10am – Phase Planning (30 min)
**Participants:** Frontend Lead, Primary Dev for phase  
**Agenda:**
- Review upcoming week's tasks
- Identify dependencies/blockers
- Clarify acceptance criteria
- Assign specific tasks
- Report on prev week's progress

### Wednesday 2pm – Cross-Team Sync (45 min)
**Participants:** Frontend Lead, Backend Lead, QA  
**Agenda:**
- Phase progress updates (% complete)
- Technical blockers & decisions
- API contract alignment (if Phase 3+)
- Integration concerns
- Timeline adjustments if needed

### Friday 3pm – Demo & Retrospective (45 min)
**Participants:** Core team + optional stakeholders  
**Agenda:**
- Live demo of completed work
- Retrospective: What went well? What didn't?
- Learning points for next phase
- Team morale & recognition

---

## Communication Protocols

### Blocker Resolution
If blocked on decision or external dependency:

1. **Document:** Create GitHub issue with:
   - What you're trying to do
   - Why you're blocked
   - What you need (decision, review, info)
   - Options if available

2. **Escalate:** Ping Frontend Lead with issue link
3. **Timeline:** Expect response within 24 hours
4. **Unblock:** Use temporary solution if possible, move to next task

### Code Review SLA
- **Phase 1-2:** 24 hours (critical path)
- **Phase 3-4:** 48 hours (complex changes)
- **Phase 5-6:** 48 hours (high stakes)

### PR Standards
- Clear description of what/why
- Link to GitHub issue
- Test evidence (screenshots, test results)
- Self-review before requesting review
- Address all feedback before merge

---

## Progress Tracking

### Real-Time Dashboard (Track in Spreadsheet or GitHub Projects)

```
Phase 1: Foundation & Architecture
├─ 1A: State Management           [████████░░] 80% - ETA Dec 30
├─ 1B: Type Consolidation         [██████░░░░] 60% - ETA Jan 2
├─ 1C: Storage Abstraction        [████░░░░░░] 40% - ETA Jan 2
└─ 1D: Code Cleanup               [██░░░░░░░░] 20% - ETA Jan 3

Overall Phase 1: [████████░░] 75% Complete
Next Phase Gate Review: January 6, 2026
```

### Metrics to Track

| Metric | Target | Check Frequency |
|--------|--------|-----------------|
| Code coverage | 80%+ | After Phase 5 |
| Build time | < 10s | Every build |
| Bundle size | < 150KB | Every build |
| Test pass rate | 100% | Every commit |
| Bug escape rate | < 1% | After each phase |
| Knowledge docs | 100% | End of project |

### Blocker Log
```
| Date | Blocker | Owner | Status | ETA |
|------|---------|-------|--------|-----|
| Dec 27 | Decision on Context vs Redux | Frontend Lead | In Review | Dec 28 |
| Jan 3 | Backend API schema finalized | Backend Lead | Waiting | Jan 6 |
```

---

## Dependency Management

### Phase 1 Has No External Dependencies
Phase 1 is self-contained and can proceed immediately.

### Phase 2 Depends On
- ✅ Phase 1 completion

### Phase 3 Depends On
- ✅ Phase 1 completion
- ⏳ Backend team delivering API contract (by end of Phase 1)
- ⏳ Database schema finalized

### Phase 4 Depends On
- ✅ Phase 3 completion
- ⏳ Backend team implementing WebSocket support
- ⏳ Authentication system in place

### Phase 5 Depends On
- ✅ Phases 1-4 stable
- ⏳ No external dependencies

### Phase 6 Depends On
- ✅ All prior phases complete (or stabilized)

### Inter-Team Dependency Tracking

**Frontend → Backend**
| Phase | Need | By | Owner | Status |
|-------|------|-------|-------|--------|
| 3 | REST API contract | Dec 31 | Backend Lead | 📋 Proposed |
| 3 | Mock server for testing | Jan 10 | Backend Dev | 📋 Proposed |
| 4 | WebSocket schema | Jan 20 | Backend Lead | ⏳ Waiting |
| 4 | Auth implementation | Jan 25 | Backend Dev | ⏳ Waiting |

**Backend → Frontend**
| Phase | Need | By | Owner | Status |
|------|------|--------|--------|--------|
| 3 | Frontend ready for API swap | Jan 15 | Frontend Lead | ✅ Planned |
| 4 | Real-time sync capabilities | Feb 5 | Frontend Lead | ✅ Planned |

---

## Common Patterns for Coordination

### "We're blocked on API design"

**Step 1: Document Current State**
```markdown
## API Contract for Todos (DRAFT)

Frontend needs these endpoints to proceed with Phase 3:

GET /api/todos
  Response: { data: Todo[], status: 200 }

POST /api/todos
  Body: { text: string, priority?: string }
  Response: { data: Todo, status: 201 }

[etc...]

Status: ⏳ Awaiting backend feedback
```

**Step 2: Request Async Review**
"@backend-lead – can you review this proposed API contract by EOD tomorrow?"

**Step 3: Proceed with Mock Server**
While waiting for backend, implement against mock data:
```typescript
// tests/mocks/todoApi.ts
export const mockTodos = [
  { id: '1', text: 'Buy milk', completed: false, ... }
]
```

**Step 4: Unblock Next Task**
"While we await API spec, let's proceed with Phase 3 test suite structure"

---

## Issue Templates

### Bug Report Template
```markdown
**Description:** 
[Clear description of the bug]

**Steps to reproduce:**
1. ...
2. ...

**Expected behavior:**
[What should happen]

**Actual behavior:**
[What actually happens]

**Phase blocked:** Phase 3 (if applicable)

**Environment:**
- Node version
- Browser
- OS
```

### Feature Request Template
```markdown
**Phase:** [1/2/3/4/5/6 or Backlog]

**User story:**
As a [user type], I want [feature], so that [benefit]

**Acceptance criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

**Effort estimate:** [1 day / 2 days / etc]

**Dependencies:** [Other phases/external work]

**Priority:** [Must have / Should have / Nice to have]
```

### Decision Template (for ADRs)
```markdown
**Issue:** [What decision is needed?]

**Options considered:**
1. Option A – [Pros/Cons]
2. Option B – [Pros/Cons]
3. Option C – [Pros/Cons]

**Decision:** [Option X]

**Rationale:** [Why this choice?]

**Consequences:** [What changes as a result?]

**Timeline:** [When to implement?]

**Reversibility:** [How hard to change later?]
```

---

## Handling Common Situations

### Scope Creep: "Can we add X to this phase?"

**Response:**
1. "That's a good idea! Let's evaluate if it fits Phase [N]"
2. Check if it aligns with phase goals
3. If yes: Add to task list with updated estimate
4. If no: "Let's add this to Phase [N+1] or backlog"
5. Update ROADMAP.md if scope changes

### Feature Conflict: "Feature A and B are incompatible"

**Resolution:**
1. Document the conflict clearly
2. Present to Frontend Lead with options:
   - Option 1: Change Feature A
   - Option 2: Change Feature B
   - Option 3: Implement differently
3. Decision made within 1 business day
4. Update ARCHITECTURE.md with rationale

### Timeline Slip: "Phase 1 will take 3 weeks, not 2"

**Action:**
1. Identify root cause (scope, complexity, blockers)
2. Propose revised timeline to Frontend Lead
3. Communicate to stakeholders (adjusted ship date)
4. Adjust Phase 2+ start dates accordingly
5. Update ROADMAP.md with new dates

### Resource Shortage: "Dev 1 is unavailable"

**Options:**
1. Shift Phase 1 start to when Dev 1 available
2. Have different dev take Phase 1A (needs some ramp-up)
3. Reduce Phase 1 scope (cut Phase 1D cleanup)
4. Bring in contractor for specific task

**Decision:** Frontend Lead + Project Manager

---

## Knowledge Transfer Checklist

### End of Each Phase
- [ ] Document what was built and why
- [ ] Record decisions in ARCHITECTURE.md
- [ ] Update implementation guide with learnings
- [ ] Do knowledge-sharing session with team
- [ ] Identify what was harder than expected

### Quarterly
- [ ] Refresh ROADMAP.md with latest reality
- [ ] Archive completed phases (move to "History" section)
- [ ] Review whether phase milestones are reasonable

---

## Success Stories & Anti-Patterns

### ✅ What Good Coordination Looks Like
- Daily standup: 2 mins per person, focused on blockers
- Clear PRs: Description explains the why, not just the what
- Early feedback: "I'm about to start X, does this align?" (not after 3 days of work)
- Blameless retrospectives: "What did we learn?" not "Who messed up?"
- Documentation updates: Every decision captured for future devs

### ❌ Patterns to Avoid
- Surprise PRs: 200 lines of changes with "Ready for review!"
- Ambiguous decisions: "Let's use Context or Redux, TBD"
- Silent blockers: Stuck on something but not mentioning it
- Dead documentation: Outdated README that confuses new contributors
- Cowboy coding: Making big architectural changes without team discussion

---

## Onboarding New Contributors to This Project

### Day 1
- [ ] Read [README.md](README.md) – understand what the project is
- [ ] Read [ROADMAP.md](ROADMAP.md) – see the big picture
- [ ] Run `npm install && npm run dev` – get app running locally
- [ ] Poke around the codebase – familiarize with structure

### Day 2
- [ ] Read [ARCHITECTURE.md](ARCHITECTURE.md) – understand design decisions
- [ ] Read [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) – learn patterns used
- [ ] Review 2-3 recent PRs – see how we work
- [ ] Ask questions: "What's the vision for this project?"

### Week 1
- [ ] Attend daily standup to meet team
- [ ] Pick a Phase 1D "cleanup" task (well-scoped, low risk)
- [ ] Open draft PR to get feedback on approach
- [ ] Ask for pairing on review if needed
- [ ] Ship your first PR!

### Ongoing
- [ ] Pick self-assigned tasks from ROADMAP.md
- [ ] Ask questions when uncertain
- [ ] Share learnings from implementation
- [ ] Help onboard next contributor

---

## Retrospective Template (Every Phase)

**Phase:** [Number and name]  
**Duration:** [Weeks]  
**Date:** [Date]

### What Went Well?
- [Item 1]
- [Item 2]

### What Could Be Better?
- [Item 1]
- [Item 2]

### Blockers We Hit
- [Item 1] – Resolved by: [solution]
- [Item 2] – Resolved by: [solution]

### Learnings for Next Phase
- [Learning 1]
- [Learning 2]

### Metrics
- Timeline: [Planned] → [Actual]
- Bugs found: [Number]
- Code coverage: [Percentage]

### Ideas for Future Improvement
- [Idea 1]
- [Idea 2]

---

## Questions to Ask Your Team

Use these to kick off the roadmap and coordinate:

1. **"What's our biggest pain point right now?"**
   - Likely answer: Scattered state, duplicate types, architecture debt
   - Roadmap response: Phase 1 fixes this

2. **"What feature are we most excited to build?"**
   - Likely answer: Team collaboration, real-time sync
   - Roadmap response: Phase 4 is that phase, but Phase 1-3 prepare for it

3. **"What would help us move faster?"**
   - Likely answer: Clear architecture, automation, fewer decisions
   - Roadmap response: Phases 1 & 5 address this

4. **"What's our deployment timeline?"**
   - Sets when roadmap needs to wrap up
   - Helps prioritize what features make MVP

5. **"Do we have dedicated resources?"**
   - Affects whether we can parallelize phases
   - Informs realistic timeline

---

**Last Updated:** December 24, 2025  
**Next Review:** After Phase 1 completion
