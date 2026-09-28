import { Trash2 } from 'lucide-react'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDateForDisplay } from '../utils/transactionUtils'

/**
 * One transaction row. Renders a bare <tr> so it composes directly into
 * TransactionList's <tbody> — each cell carries a data-label that the
 * stylesheet uses to relabel itself when the table collapses into cards
 * on narrow screens.
 */
function TransactionItem({ transaction, onRequestDelete }) {
  const isIncome = transaction.type === 'income'

  return (
    <tr className="transaction-row">
      <td className="transaction-row__cell" data-label="Date">
        {formatDateForDisplay(transaction.date)}
      </td>
      <td
        className="transaction-row__cell transaction-row__description"
        data-label="Description"
      >
        {transaction.description}
      </td>
      <td className="transaction-row__cell" data-label="Category">
        <span className="category-tag">{transaction.category}</span>
      </td>
      <td className="transaction-row__cell" data-label="Type">
        <span className={`type-tag type-tag--${transaction.type}`}>
          {isIncome ? 'Income' : 'Expense'}
        </span>
      </td>
      <td
        className={`transaction-row__cell transaction-row__amount transaction-row__amount--${transaction.type}`}
        data-label="Amount"
      >
        {isIncome ? '+ ' : '- '}
        {formatCurrency(transaction.amount)}
      </td>
      <td
        className="transaction-row__cell transaction-row__actions"
        data-label="Action"
      >
        <button
          type="button"
          className="icon-button icon-button--danger"
          onClick={() => onRequestDelete(transaction)}
          aria-label={`Delete transaction: ${transaction.description}`}
        >
          <Trash2 aria-hidden="true" size={17} />
        </button>
      </td>
    </tr>
  )
}

export default TransactionItem
