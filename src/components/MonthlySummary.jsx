import { useMemo, useState } from 'react'
import { formatCurrency } from '../utils/formatCurrency'
import {
  calculateSummary,
  getAvailableMonths,
  getMonthLabel,
  getTransactionsForMonth,
} from '../utils/transactionUtils'

/** Lets the person browse income/expense/balance totals month by month. */
function MonthlySummary({ transactions }) {
  const availableMonths = useMemo(
    () => getAvailableMonths(transactions),
    [transactions]
  )
  const [selectedMonth, setSelectedMonth] = useState(availableMonths[0] ?? null)

  // Self-heals if the selected month's last transaction gets deleted out
  // from under it, falling back to the most recent month that still exists.
  const activeMonth = availableMonths.includes(selectedMonth)
    ? selectedMonth
    : availableMonths[0] ?? null

  if (!activeMonth) {
    return (
      <section className="panel" aria-label="Monthly summary">
        <h2 className="panel-heading">Monthly Summary</h2>
        <p className="empty-state">Add a transaction to see monthly totals.</p>
      </section>
    )
  }

  const summary = calculateSummary(
    getTransactionsForMonth(transactions, activeMonth)
  )

  return (
    <section className="panel" aria-label="Monthly summary">
      <div className="monthly-summary__header">
        <h2 className="panel-heading">Monthly Summary</h2>
        <label className="sr-only" htmlFor="monthly-summary-select">
          Select month
        </label>
        <select
          id="monthly-summary-select"
          className="select-input"
          value={activeMonth}
          onChange={(event) => setSelectedMonth(event.target.value)}
        >
          {availableMonths.map((month) => (
            <option key={month} value={month}>
              {getMonthLabel(month)}
            </option>
          ))}
        </select>
      </div>

      <dl className="monthly-summary__grid">
        <div>
          <dt>Income</dt>
          <dd>{formatCurrency(summary.totalIncome)}</dd>
        </div>
        <div>
          <dt>Expenses</dt>
          <dd>{formatCurrency(summary.totalExpenses)}</dd>
        </div>
        <div>
          <dt>Balance</dt>
          <dd
            className={
              summary.balance < 0 ? 'monthly-summary__negative' : undefined
            }
          >
            {formatCurrency(summary.balance, { signed: true })}
          </dd>
        </div>
        <div>
          <dt>Transactions</dt>
          <dd>{summary.count}</dd>
        </div>
      </dl>
    </section>
  )
}

export default MonthlySummary
