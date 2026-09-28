import { useState } from 'react'
import FilterBar from '../components/FilterBar'
import TransactionList from '../components/TransactionList'
import ConfirmDialog from '../components/ConfirmDialog'
import { filterAndSortTransactions } from '../utils/transactionUtils'

function Transactions({
  transactions,
  isLoading,
  onDeleteTransaction,
  onClearAll,
}) {
  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all',
    sortBy: 'newest',
  })
  const [confirmingClearAll, setConfirmingClearAll] = useState(false)

  if (isLoading) {
    return <p className="loading-state">Loading your transactions…</p>
  }

  const hasAnyTransactions = transactions.length > 0
  const filteredTransactions = filterAndSortTransactions(transactions, filters)
  const emptyMessage = hasAnyTransactions
    ? 'No transactions match your filters.'
    : 'No transactions yet. Add one from the Dashboard.'

  return (
    <div className="page">
      <div className="panel-header-row">
        <h1 className="page-heading">Transactions</h1>
        {hasAnyTransactions && (
          <button
            type="button"
            className="button button--secondary"
            onClick={() => setConfirmingClearAll(true)}
          >
            Clear all data
          </button>
        )}
      </div>

      <FilterBar
        category={filters.category}
        type={filters.type}
        sortBy={filters.sortBy}
        onCategoryChange={(category) =>
          setFilters((prev) => ({ ...prev, category }))
        }
        onTypeChange={(type) => setFilters((prev) => ({ ...prev, type }))}
        onSortChange={(sortBy) =>
          setFilters((prev) => ({ ...prev, sortBy }))
        }
      />

      <section className="panel" aria-label="All transactions">
        <TransactionList
          transactions={filteredTransactions}
          onDelete={onDeleteTransaction}
          emptyMessage={emptyMessage}
        />
      </section>

      <ConfirmDialog
        id="clear-all-dialog"
        open={confirmingClearAll}
        title="Clear all transactions?"
        message="This will permanently delete your entire transaction history. This cannot be undone."
        confirmLabel="Clear All"
        onConfirm={() => {
          onClearAll()
          setConfirmingClearAll(false)
        }}
        onCancel={() => setConfirmingClearAll(false)}
      />
    </div>
  )
}

export default Transactions
