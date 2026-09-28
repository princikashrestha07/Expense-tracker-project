import { getAllCategories } from '../utils/transactionUtils'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'highest', label: 'Highest Amount' },
  { value: 'lowest', label: 'Lowest Amount' },
]

/** Controlled filter/sort controls — all state lives in the parent page. */
function FilterBar({
  category,
  type,
  sortBy,
  onCategoryChange,
  onTypeChange,
  onSortChange,
}) {
  return (
    <fieldset className="filter-bar">
      <legend className="panel-heading">Filter &amp; Sort</legend>

      <div className="filter-bar__fields">
        <div className="filter-bar__field">
          <label htmlFor="filter-category">Category</label>
          <select
            id="filter-category"
            className="select-input"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            <option value="all">All Categories</option>
            {getAllCategories().map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-bar__field">
          <label htmlFor="filter-type">Type</label>
          <select
            id="filter-type"
            className="select-input"
            value={type}
            onChange={(event) => onTypeChange(event.target.value)}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="filter-bar__field">
          <label htmlFor="filter-sort">Sort by</label>
          <select
            id="filter-sort"
            className="select-input"
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </fieldset>
  )
}

export default FilterBar
