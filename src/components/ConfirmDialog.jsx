import { useEffect, useRef } from 'react'

/**
 * A reusable "are you sure?" dialog built on the native <dialog> element,
 * which gives us a real focus trap and ESC-to-dismiss for free. React
 * state (the `open` prop) stays the single source of truth: this component
 * only ever calls the imperative showModal()/close() methods to bring the
 * DOM in line with that state, in an effect.
 *
 * `onCancel` fires both for the Cancel button and for any native dismissal
 * (ESC, the dialog's own close event) — that keeps React's state in sync
 * with the DOM even when the dialog is closed a way this component didn't
 * initiate itself.
 */
function ConfirmDialog({
  id,
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null)
  const cancelButtonRef = useRef(null)
  const titleId = `${id}-title`

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      cancelButtonRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      id={id}
      className="confirm-dialog"
      aria-labelledby={titleId}
      onClose={onCancel}
    >
      <h2 id={titleId} className="confirm-dialog__title">
        {title}
      </h2>
      <p className="confirm-dialog__message">{message}</p>
      <div className="confirm-dialog__actions">
        <button
          ref={cancelButtonRef}
          type="button"
          className="button button--secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="button button--danger"
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  )
}

export default ConfirmDialog
