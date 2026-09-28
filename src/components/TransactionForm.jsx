import { useEffect, useId, useRef, useState } from 'react'
import FormField from './FormField'
import {
  getCategoriesForType,
  getTodayDateInputValue,
  validateAmount,
} from '../utils/transactionUtils'

const SUCCESS_MESSAGE_DURATION_MS = 2500

/** Controlled form for adding a new income or expense transaction. */
function TransactionForm({ onAddTransaction }) {
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(() => getCategoriesForType('expense')[0])
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(getTodayDateInputValue)
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  const amountInputRef = useRef(null)
  const formId = useId()

  // Auto-dismiss the success message a couple of seconds after it appears.
  useEffect(() => {
    if (!showSuccess) return
    const timeoutId = setTimeout(
      () => setShowSuccess(false),
      SUCCESS_MESSAGE_DURATION_MS
    )
    return () => clearTimeout(timeoutId)
  }, [showSuccess])

  function handleTypeChange(nextType) {
    setType(nextType)
    setCategory(getCategoriesForType(nextType)[0])
  }

  function handleSubmit(event) {
    event.preventDefault()

    const amountResult = validateAmount(amount)
    const trimmedDescription = description.trim()
    const nextErrors = {}

    if (!amountResult.valid) nextErrors.amount = amountResult.error
    if (!trimmedDescription) nextErrors.description = 'Enter a description.'
    if (!date) nextErrors.date = 'Choose a date.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onAddTransaction({
      type,
      amount: amountResult.value,
      category,
      description: trimmedDescription,
      date,
    })

    setAmount('')
    setDescription('')
    setDate(getTodayDateInputValue())
    setErrors({})
    setShowSuccess(true)
    amountInputRef.current?.focus()
  }

  const amountId = `${formId}-amount`
  const categoryId = `${formId}-category`
  const descriptionId = `${formId}-description`
  const dateId = `${formId}-date`

  return (
    <form className="transaction-form" onSubmit={handleSubmit} noValidate>
      <h2 className="panel-heading">Add a Transaction</h2>

      <fieldset className="transaction-form__type">
        <legend className="form-field__label">Transaction Type</legend>
        <div className="type-toggle-group">
          {['expense', 'income'].map((option) => (
            <label
              key={option}
              className={`type-toggle type-toggle--${option}`}
            >
              <input
                type="radio"
                name={`${formId}-type`}
                value={option}
                checked={type === option}
                onChange={() => handleTypeChange(option)}
                className="type-toggle__input"
              />
              {option === 'expense' ? 'Expense' : 'Income'}
            </label>
          ))}
        </div>
      </fieldset>

      <FormField
        id={amountId}
        label="Amount"
        error={errors.amount}
        hint="Enter an amount greater than zero."
      >
        <div className="input-prefix-group">
          <span className="input-prefix" aria-hidden="true">
            Rs
          </span>
          <input
            ref={amountInputRef}
            id={amountId}
            name="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            className="text-input text-input--with-prefix"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={
              errors.amount ? `${amountId}-error` : `${amountId}-hint`
            }
          />
        </div>
      </FormField>

      <FormField id={categoryId} label="Category">
        <select
          id={categoryId}
          name="category"
          className="select-input"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {getCategoriesForType(type).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        id={descriptionId}
        label="Description"
        error={errors.description}
      >
        <input
          id={descriptionId}
          name="description"
          type="text"
          className="text-input"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What was this for?"
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? `${descriptionId}-error` : undefined
          }
        />
      </FormField>

      <FormField id={dateId} label="Date" error={errors.date}>
        <input
          id={dateId}
          name="date"
          type="date"
          className="text-input"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          aria-invalid={Boolean(errors.date)}
          aria-describedby={errors.date ? `${dateId}-error` : undefined}
        />
      </FormField>

      <button
        type="submit"
        className="button button--primary transaction-form__submit"
      >
        Add Transaction
      </button>

      {showSuccess && (
        <p className="form-success" role="status">
          Transaction added.
        </p>
      )}
    </form>
  )
}

export default TransactionForm
