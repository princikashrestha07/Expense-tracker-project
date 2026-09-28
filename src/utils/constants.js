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
  Food: '#D97991',
  Entertainment: '#D9A45B',
  Bills: '#A9798B',
  Health: '#8BB8A5',
  Transport: '#8CB5C8',
  Shopping: '#A690C8',
  Education: '#C889AF',
  Other: '#A99AA3',
}

export const DEFAULT_CATEGORY_COLOR = '#A99AA3'

// The currency symbol and locale used for every amount in the app. Kept in
// one spot so switching currencies later is a one-line change.
export const CURRENCY = {
  symbol: 'Rs',
  locale: 'en-US',
}

// Used until the person sets their own monthly budget.
export const DEFAULT_BUDGET = 25000
