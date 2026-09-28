import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  CATEGORY_COLORS,
  DEFAULT_CATEGORY_COLOR,
  DEFAULT_BUDGET,
} from './constants'

/** Creates a unique id for a new transaction. */
export function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // crypto.randomUUID requires a secure context; fall back for browsers
  // viewing the app over plain http (e.g. a phone on the local network).
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** Category options for a given transaction type. */
export function getCategoriesForType(type) {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}

/** Every category across both types, deduplicated, for the "All" filter. */
export function getAllCategories() {
  return [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])]
}

/**
 * Parses a "YYYY-MM-DD" string into a local Date at midnight. Building the
 * date from its parts (rather than `new Date(dateString)`) avoids the
 * classic bug where the built-in parser reads the string as UTC and the
 * date silently shifts by a day in timezones behind UTC.
 */
export function parseLocalDate(dateString) {
  if (typeof dateString !== 'string') return new Date(NaN)
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString)
  if (!match) return new Date(NaN)
  const [, year, month, day] = match.map(Number)
  return new Date(year, month - 1, day)
}

/**
 * True only for a real, non-overflowing calendar date. The Date constructor
 * quietly rolls "Feb 30" into "Mar 2" instead of failing, so a valid parse
 * isn't enough on its own — this checks the parts round-trip unchanged.
 */
export function isValidDateString(dateString) {
  const date = parseLocalDate(dateString)
  if (Number.isNaN(date.getTime())) return false
  const [year, month, day] = dateString.split('-').map(Number)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

/** Today's date as a "YYYY-MM-DD" string, in the viewer's local time. */
export function getTodayDateInputValue() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function formatDateForDisplay(dateString) {
  const date = parseLocalDate(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Validates a raw amount input string. Returns the parsed, cent-rounded
 * value on success so callers never have to re-parse the string.
 */
export function validateAmount(rawValue) {
  const trimmed = String(rawValue).trim()
  if (trimmed === '') {
    return { valid: false, error: 'Enter an amount.' }
  }
  const value = Number(trimmed)
  if (!Number.isFinite(value)) {
    return { valid: false, error: 'Enter a valid number.' }
  }
  if (value <= 0) {
    return { valid: false, error: 'Amount must be greater than zero.' }
  }
  return { valid: true, value: Math.round(value * 100) / 100 }
}

/** Structural check used when reading transactions back out of storage. */
export function isValidTransaction(item) {
  if (!item || typeof item !== 'object') return false
  const { id, type, amount, category, description, date } = item
  if (typeof id !== 'string' || id === '') return false
  if (type !== 'income' && type !== 'expense') return false
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    return false
  }
  if (typeof category !== 'string' || category === '') return false
  if (typeof description !== 'string' || description.trim() === '') return false
  if (!isValidDateString(date)) return false
  return true
}

/** Drops anything in a stored array that isn't a well-formed transaction. */
export function sanitizeTransactions(raw) {
  if (!Array.isArray(raw)) return []
  return raw.filter(isValidTransaction)
}

/** Structural check used when reading the saved budget back out of storage. */
export function sanitizeBudget(parsed) {
  return typeof parsed === 'number' && Number.isFinite(parsed) && parsed >= 0
    ? parsed
    : DEFAULT_BUDGET
}

/**
 * Totals for a set of transactions. Sums in integer cents rather than
 * floating-point rupees so repeated additions can't drift off by fractions
 * of a cent.
 */
export function calculateSummary(transactions) {
  const cents = transactions.reduce(
    (acc, t) => {
      const amountCents = Math.round(t.amount * 100)
      if (t.type === 'income') acc.income += amountCents
      else acc.expenses += amountCents
      return acc
    },
    { income: 0, expenses: 0 }
  )
  return {
    totalIncome: cents.income / 100,
    totalExpenses: cents.expenses / 100,
    balance: (cents.income - cents.expenses) / 100,
    count: transactions.length,
  }
}

/**
 * Returns a new, filtered and sorted array — the source array is never
 * mutated, so it stays safe to reuse as the single source of truth in state.
 */
export function filterAndSortTransactions(
  transactions,
  { category = 'all', type = 'all', sortBy = 'newest' } = {}
) {
  const filtered = transactions.filter((t) => {
    const matchesCategory = category === 'all' || t.category === category
    const matchesType = type === 'all' || t.type === type
    return matchesCategory && matchesType
  })

  return [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return parseLocalDate(a.date) - parseLocalDate(b.date)
      case 'highest':
        return b.amount - a.amount
      case 'lowest':
        return a.amount - b.amount
      case 'newest':
      default:
        return parseLocalDate(b.date) - parseLocalDate(a.date)
    }
  })
}

/** Expense-only totals per category, largest first, for the spending chart. */
export function getCategoryTotals(transactions) {
  const totals = new Map()
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount)
  }
  return [...totals.entries()]
    .map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
      color: CATEGORY_COLORS[category] ?? DEFAULT_CATEGORY_COLOR,
    }))
    .sort((a, b) => b.amount - a.amount)
}

export function getMonthKey(dateString) {
  const date = parseLocalDate(dateString)
  if (Number.isNaN(date.getTime())) return null
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function getMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

/** Month keys present in the data, newest first. */
export function getAvailableMonths(transactions) {
  const keys = new Set()
  for (const t of transactions) {
    const key = getMonthKey(t.date)
    if (key) keys.add(key)
  }
  return [...keys].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0))
}

export function getTransactionsForMonth(transactions, monthKey) {
  return transactions.filter((t) => getMonthKey(t.date) === monthKey)
}
