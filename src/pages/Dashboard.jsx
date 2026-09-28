import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import SummaryCards from '../components/SummaryCards'
import TransactionForm from '../components/TransactionForm'
import SpendingChart from '../components/SpendingChart'
import BudgetCard from '../components/BudgetCard'
import MonthlySummary from '../components/MonthlySummary'
import TransactionList from '../components/TransactionList'
import {
  calculateSummary,
  filterAndSortTransactions,
  getMonthKey,
  getTodayDateInputValue,
  getTransactionsForMonth,
} from '../utils/transactionUtils'

const RECENT_TRANSACTIONS_LIMIT = 5

function Dashboard({
  transactions,
  budget,
  isLoading,
  onAddTransaction,
  onUpdateBudget,
  onDeleteTransaction,
  onLoadSampleData,
}) {
  const summary = useMemo(() => calculateSummary(transactions), [transactions])

  const recentTransactions = useMemo(
    () =>
      filterAndSortTransactions(transactions, { sortBy: 'newest' }).slice(
        0,
        RECENT_TRANSACTIONS_LIMIT
      ),
    [transactions]
  )

  // The budget always tracks the real current month, independently of
  // whatever month is selected in the Monthly Summary browser below.
  const currentMonthKey = getMonthKey(getTodayDateInputValue())
  const currentMonthSpent = useMemo(
    () =>
      calculateSummary(getTransactionsForMonth(transactions, currentMonthKey))
        .totalExpenses,
    [transactions, currentMonthKey]
  )

  if (isLoading) {
    return <p className="loading-state">Loading your dashboard…</p>
  }

  return (
    <div className="page">
      <h1 className="page-heading">Personal Finance Dashboard</h1>

      <SummaryCards
        totalIncome={summary.totalIncome}
        totalExpenses={summary.totalExpenses}
        balance={summary.balance}
        count={summary.count}
      />

      <div className="dashboard-grid">
        <TransactionForm onAddTransaction={onAddTransaction} />
        <SpendingChart transactions={transactions} />
      </div>

      <div className="dashboard-grid">
        <BudgetCard
          budget={budget}
          spent={currentMonthSpent}
          onUpdateBudget={onUpdateBudget}
        />
        <MonthlySummary transactions={transactions} />
      </div>

      <section className="panel" aria-label="Recent transactions">
        <div className="panel-header-row">
          <h2 className="panel-heading">Recent Transactions</h2>
          {transactions.length > 0 && (
            <Link to="/transactions" className="link">
              View all
            </Link>
          )}
        </div>

        {transactions.length === 0 ? (
          <div className="empty-state-block">
            <p className="empty-state">
              No transactions yet. Add your first one above.
            </p>
            <button
              type="button"
              className="button button--secondary"
              onClick={onLoadSampleData}
            >
              Load sample data
            </button>
          </div>
        ) : (
          <TransactionList
            transactions={recentTransactions}
            onDelete={onDeleteTransaction}
          />
        )}
      </section>
    </div>
  )
}

export default Dashboard
