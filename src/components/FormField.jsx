/**
 * Wraps a single form control with a label and, depending on state, a hint
 * or an error message. The caller renders the actual input/select as
 * `children` and is responsible for giving it the matching `id` and
 * `aria-describedby`/`aria-invalid` attributes so screen readers get the
 * connection too.
 */
function FormField({ id, label, hint, error, children }) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="form-field__error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="form-field__hint">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export default FormField
