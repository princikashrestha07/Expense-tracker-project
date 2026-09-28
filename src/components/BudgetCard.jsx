import { useEffect, useId, useRef, useState } from 'react'
import { Pencil, AlertTriangle } from 'lucide-react'
import FormField from './FormField'
import { formatCurrency } from '../utils/formatCurrency'
import { validateAmount } from '../utils/transactionUtils'

/** This month's budget: the figures, a progress bar, and an edit form. */
function BudgetCard({ budget, spent, onUpdateBudget }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftValue, setDraftValue] = useState('')
  const [error, setError] = useState('')
  const inputId = useId()
  const editInputRef = useRef(null)

  useEffect(() => {
    if (isEditing) editInputRef.current?.focus()
  }, [isEditing])

  const isOverBudget = spent > budget
  const remaining = budget - spent
  const percentUsed = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0

  function startEditing() {
    setDraftValue(String(budget))
    setError('')
    setIsEditing(true)
  }

  function handleSave(event) {
    event.preventDefault()
    const result = validateAmount(draftValue)
    if (!result.valid) {
      setError(result.error)
      return
    }
    onUpdateBudget(result.value)
    setIsEditing(false)
  }

  return (
    <section className="panel budget-card" aria-label="Monthly budget">
      <div className="budget-card__header">
        <h2 className="panel-heading">Monthly Budget</h2>
        {!isEditing && (
          <button
            type="button"
            className="icon-button"
            onClick={startEditing}
            aria-label="Edit monthly budget"
          >
            <Pencil aria-hidden="true" size={16} />
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="budget-card__edit-form">
          <FormField id={inputId} label="Monthly budget" error={error}>
            <div className="input-prefix-group">
              <span className="input-prefix" aria-hidden="true">
                Rs
              </span>
              <input
                ref={editInputRef}
                id={inputId}
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                className="text-input text-input--with-prefix"
                value={draftValue}
                onChange={(event) => setDraftValue(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${inputId}-error` : undefined}
              />
            </div>
          </FormField>
          <div className="budget-card__edit-actions">
            <button
              type="button"
              className="button button--secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button type="submit" className="button button--primary">
              Save
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="budget-card__figures">
            <div>
              <p className="budget-card__label">Budget</p>
              <p className="budget-card__value">{formatCurrency(budget)}</p>
            </div>
            <div>
              <p className="budget-card__label">Spent</p>
              <p className="budget-card__value">{formatCurrency(spent)}</p>
            </div>
            <div>
              <p className="budget-card__label">Remaining</p>
              <p
                className={`budget-card__value ${
                  remaining < 0 ? 'budget-card__value--negative' : ''
                }`}
              >
                {formatCurrency(remaining, { signed: true })}
              </p>
            </div>
          </div>

          <div
            className="progress-track"
            role="progressbar"
            aria-valuenow={Math.round(percentUsed)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Percent of monthly budget spent"
          >
            <div
              className={`progress-fill ${
                isOverBudget ? 'progress-fill--over' : ''
              }`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>

          {isOverBudget && (
            <p className="budget-warning" role="alert">
              <AlertTriangle aria-hidden="true" size={16} />
              Warning: You have exceeded your monthly budget.
            </p>
          )}
        </>
      )}
    </section>
  )
}

export default BudgetCard
