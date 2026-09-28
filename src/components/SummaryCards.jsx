import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '../utils/formatCurrency'

/** The four top-level totals, driven entirely by props from the page. */
function SummaryCards({ totalIncome, totalExpenses, balance, count }) {
  const isSurplus = balance >= 0

  return (
    <section className="summary" aria-label="Account summary">
      <div
        className={`summary-hero ${
          isSurplus ? 'summary-hero--positive' : 'summary-hero--negative'
        }`}
      >
        <p className="summary-hero__label">Total Balance</p>
        <p className="summary-hero__value">
          {isSurplus ? (
            <TrendingUp aria-hidden="true" className="summary-hero__icon" />
          ) : (
            <TrendingDown aria-hidden="true" className="summary-hero__icon" />
          )}
          {formatCurrency(balance, { signed: true })}
        </p>
        <p className="summary-hero__caption">
          {isSurplus ? 'Surplus' : 'Deficit'} across all recorded transactions
        </p>
      </div>

      <div className="summary-grid">
        <div className="summary-card summary-card--income">
          <p className="summary-card__label">Income</p>
          <p className="summary-card__value">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="summary-card summary-card--expense">
          <p className="summary-card__label">Expenses</p>
          <p className="summary-card__value">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="summary-card">
          <p className="summary-card__label">Transactions</p>
          <p className="summary-card__value">{count}</p>
        </div>
      </div>
    </section>
  )
}

export default SummaryCards
