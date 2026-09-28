import { formatCurrency } from '../utils/formatCurrency'
import { getCategoryTotals } from '../utils/transactionUtils'
import { buildDonutSegments, buildConicGradient } from '../utils/chartUtils'

/** Expense-only breakdown by category, as a donut chart with a text legend. */
function SpendingChart({ transactions }) {
  const categoryTotals = getCategoryTotals(transactions)

  if (categoryTotals.length === 0) {
    return (
      <section className="panel" aria-label="Spending by category">
        <h2 className="panel-heading">Spending by Category</h2>
        <p className="empty-state">
          Add an expense to see your spending breakdown.
        </p>
      </section>
    )
  }

  const segments = buildDonutSegments(categoryTotals)
  const total = categoryTotals.reduce((sum, c) => sum + c.amount, 0)

  return (
    <section className="panel" aria-label="Spending by category">
      <h2 className="panel-heading">Spending by Category</h2>
      <div className="spending-chart">
        {/* Decorative: every value here is repeated as real text in the
            legend list below, so the chart itself is hidden from screen
            readers rather than described. */}
        <div
          className="donut"
          style={{ background: buildConicGradient(segments) }}
          aria-hidden="true"
        >
          <div className="donut__hole">
            <span className="donut__hole-label">Total Spent</span>
            <span className="donut__hole-value">{formatCurrency(total)}</span>
          </div>
        </div>

        <ul className="chart-legend">
          {segments.map((segment) => (
            <li key={segment.category} className="chart-legend__item">
              <span
                className="chart-legend__swatch"
                style={{ backgroundColor: segment.color }}
                aria-hidden="true"
              />
              <span className="chart-legend__label">{segment.category}</span>
              <span className="chart-legend__value">
                {formatCurrency(segment.amount)}
                <span className="chart-legend__percent">
                  {' '}
                  ({segment.percent.toFixed(0)}%)
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default SpendingChart
