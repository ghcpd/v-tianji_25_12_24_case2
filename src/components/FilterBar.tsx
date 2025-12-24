import './FilterBar.css'

// NOTE: Filter type also defined in src/types/index.ts
// Should we import from there or keep local? Need to decide on approach
type Filter = 'all' | 'active' | 'completed'

interface FilterBarProps {
  currentFilter: Filter
  onFilterChange: (filter: Filter) => void
}

// Simple functional component
// TODO: Maybe add more filters like "by priority" or "by date"
function FilterBar({ currentFilter, onFilterChange }: FilterBarProps) {
  const filters: Filter[] = ['all', 'active', 'completed']

  return (
    <div className="filter-bar">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`filter-btn ${currentFilter === filter ? 'active' : ''}`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  )
}

export default FilterBar

