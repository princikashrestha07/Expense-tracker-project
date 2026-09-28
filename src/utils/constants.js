// Central place for the fixed lists and keys the rest of the app relies on,
// so a category or storage key only ever has to change in one place.

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Other',
]

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Other',
]

export const STORAGE_KEYS = {
  TRANSACTIONS: 'expense_tracker_transactions',
  BUDGET: 'expense_tracker_budget',
}

// One accent per expense category for the spending chart's donut slices and
// legend. Chosen to stay distinguishable from one another; the legend always
// pairs each swatch with its category name, so meaning never rests on color
// alone.
export const CATEGORY_COLORS = {
  Food: '#AE4530',
  Entertainment: '#B8862E',
  Bills: '#6B5637',
  Health: '#1E6350',
  Transport: '#2E7D82',
  Shopping: '#3D6E9C',
  Education: '#7C5C9C',
  Other: '#6B7280',
}

export const DEFAULT_CATEGORY_COLOR = '#6B7280'

// The currency symbol and locale used for every amount in the app. Kept in
// one spot so switching currencies later is a one-line change.
export const CURRENCY = {
  symbol: 'Rs',
  locale: 'en-US',
}

// Used until the person sets their own monthly budget.
export const DEFAULT_BUDGET = 25000
