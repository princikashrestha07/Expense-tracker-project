import { useState } from 'react'
import TransactionItem from './TransactionItem'
import ConfirmDialog from './ConfirmDialog'

/**
 * Purely presentational: renders whatever transactions it's given, in the
 * order it's given them. Pages decide what subset that is (recent-only,
 * filtered, etc.) and what to say when the list is empty.
 */
function TransactionList({
  transactions,
  onDelete,
  emptyMessage = 'No transactions yet.',
}) {
  const [pendingDelete, setPendingDelete] = useState(null)

  if (transactions.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>
  }

  return (
    <>
      <div className="transaction-table-wrapper">
        <table className="transaction-table">
          <caption className="sr-only">
            Transactions with date, description, category, type, and amount
          </caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Description</th>
              <th scope="col">Category</th>
              <th scope="col">Type</th>
              <th scope="col">Amount</th>
              <th scope="col">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onRequestDelete={setPendingDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        id="delete-transaction-dialog"
        open={pendingDelete !== null}
        title="Delete this transaction?"
        message={
          pendingDelete
            ? `"${pendingDelete.description}" will be permanently removed.`
            : ''
        }
        confirmLabel="Delete"
        onConfirm={() => {
          onDelete(pendingDelete.id)
          setPendingDelete(null)
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}

export default TransactionList
