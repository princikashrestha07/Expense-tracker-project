import { generateId } from './transactionUtils'

/** The given day-of-month, `monthsAgo` calendar months back. Safe for any
 * dayOfMonth from 1-27 regardless of how many days each month has. */
function dateInMonth(monthsAgo, dayOfMonth) {
  const now = new Date()
  const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, dayOfMonth)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/** N days before today - always a valid past date, used for "this month" so
 * entries never land in the future no matter what day of the month it is. */
function daysAgo(n) {
  const date = new Date()
  date.setDate(date.getDate() - n)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

// Three months of realistic activity: a quiet month, a heavier month that
// runs over the default budget, and the current month so far.
const TEMPLATES = [
  // Two months ago - comfortably under budget.
  { date: dateInMonth(2, 1), type: 'income', category: 'Salary', amount: 45000, description: 'Salary' },
  { date: dateInMonth(2, 2), type: 'expense', category: 'Food', amount: 350, description: 'Momo lunch with friends' },
  { date: dateInMonth(2, 4), type: 'expense', category: 'Transport', amount: 120, description: 'Bus fare to office' },
  { date: dateInMonth(2, 5), type: 'income', category: 'Freelance', amount: 12000, description: 'Freelance - website project' },
  { date: dateInMonth(2, 6), type: 'expense', category: 'Bills', amount: 1800, description: 'Internet bill' },
  { date: dateInMonth(2, 9), type: 'expense', category: 'Food', amount: 600, description: 'Groceries' },
  { date: dateInMonth(2, 12), type: 'expense', category: 'Shopping', amount: 2200, description: 'New shoes' },
  { date: dateInMonth(2, 16), type: 'expense', category: 'Entertainment', amount: 500, description: 'Movie tickets' },
  { date: dateInMonth(2, 20), type: 'expense', category: 'Food', amount: 280, description: 'Coffee and snacks' },
  { date: dateInMonth(2, 24), type: 'expense', category: 'Health', amount: 450, description: 'Pharmacy' },

  // Last month - a heavier month that runs over budget.
  { date: dateInMonth(1, 1), type: 'income', category: 'Salary', amount: 45000, description: 'Salary' },
  { date: dateInMonth(1, 4), type: 'expense', category: 'Food', amount: 420, description: 'Daal bhat with family' },
  { date: dateInMonth(1, 6), type: 'expense', category: 'Transport', amount: 150, description: 'Taxi fare' },
  { date: dateInMonth(1, 8), type: 'expense', category: 'Bills', amount: 2100, description: 'Electricity bill' },
  { date: dateInMonth(1, 11), type: 'expense', category: 'Shopping', amount: 3800, description: 'Winter jacket' },
  { date: dateInMonth(1, 14), type: 'expense', category: 'Food', amount: 380, description: 'Dinner out' },
  { date: dateInMonth(1, 16), type: 'expense', category: 'Shopping', amount: 12000, description: 'New laptop for freelance work' },
  { date: dateInMonth(1, 18), type: 'expense', category: 'Entertainment', amount: 650, description: 'Streaming subscription' },
  { date: dateInMonth(1, 21), type: 'expense', category: 'Education', amount: 4500, description: 'Online course fee' },
  { date: dateInMonth(1, 24), type: 'expense', category: 'Food', amount: 300, description: 'Groceries top-up' },
  { date: dateInMonth(1, 26), type: 'expense', category: 'Health', amount: 1300, description: 'Doctor visit' },
  { date: dateInMonth(1, 27), type: 'expense', category: 'Transport', amount: 200, description: 'Fuel' },

  // This month, up to today.
  { date: daysAgo(21), type: 'income', category: 'Salary', amount: 45000, description: 'Salary' },
  { date: daysAgo(19), type: 'expense', category: 'Food', amount: 400, description: 'Momo lunch with friends' },
  { date: daysAgo(18), type: 'expense', category: 'Transport', amount: 150, description: 'Bus fare to office' },
  { date: daysAgo(17), type: 'expense', category: 'Bills', amount: 2200, description: 'Internet and electricity bill' },
  { date: daysAgo(15), type: 'expense', category: 'Shopping', amount: 6500, description: 'New office chair' },
  { date: daysAgo(13), type: 'expense', category: 'Food', amount: 550, description: 'Dinner with friends' },
  { date: daysAgo(11), type: 'expense', category: 'Entertainment', amount: 700, description: 'Concert tickets' },
  { date: daysAgo(10), type: 'income', category: 'Freelance', amount: 15000, description: 'Freelance - website project' },
  { date: daysAgo(8), type: 'expense', category: 'Health', amount: 600, description: 'Pharmacy' },
  { date: daysAgo(6), type: 'expense', category: 'Food', amount: 320, description: 'Groceries' },
  { date: daysAgo(5), type: 'expense', category: 'Education', amount: 3500, description: 'Design course subscription' },
  { date: daysAgo(3), type: 'expense', category: 'Transport', amount: 180, description: 'Fuel' },
  { date: daysAgo(1), type: 'expense', category: 'Food', amount: 450, description: 'Weekend brunch' },
]

/** Builds a fresh set of realistic sample transactions spanning ~3 months. */
export function generateSampleTransactions() {
  return TEMPLATES.map((t) => ({
    id: generateId(),
    type: t.type,
    amount: t.amount,
    category: t.category,
    description: t.description,
    date: t.date,
  }))
}
