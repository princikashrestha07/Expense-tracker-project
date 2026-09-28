import { useEffect, useRef, useState } from 'react'

/**
 * Keeps a piece of state in sync with a localStorage key.
 *
 * Reading happens once, in an effect on mount, so the first render can show
 * a loading state instead of guessing at data before it's actually been
 * read. Writes are held back until that initial read finishes — in
 * development, Strict Mode runs effects twice, and without this guard a
 * same-tick "save" effect could fire before the "load" effect's state
 * update has landed, overwriting real stored data with the untouched
 * initial value.
 *
 * `sanitize` and `initialValue` are only read on the very first mount (via a
 * ref), so passing a new inline function or literal on every render is
 * fine — it will not re-trigger the read or cause a render loop.
 *
 * @param {string} key
 * @param {*} initialValue - used before hydration and if storage is empty
 * @param {(parsed: unknown) => *} [sanitize] - validates/cleans parsed JSON
 * @returns {[*, Function, boolean]} [value, setValue, isLoading]
 */
export function useLocalStorage(key, initialValue, sanitize) {
  const [value, setValue] = useState(initialValue)
  const [isLoading, setIsLoading] = useState(true)
  const initialValueRef = useRef(initialValue)
  const sanitizeRef = useRef(sanitize)

  useEffect(() => {
    let nextValue = initialValueRef.current
    try {
      const raw = window.localStorage.getItem(key)
      if (raw !== null) {
        const parsed = JSON.parse(raw)
        nextValue = sanitizeRef.current ? sanitizeRef.current(parsed) : parsed
      }
    } catch {
      nextValue = initialValueRef.current
    }
    setValue(nextValue)
    setIsLoading(false)
    // initialValue and sanitize are intentionally read once via refs (see
    // doc comment above), so only key belongs in this dependency list.
  }, [key])

  useEffect(() => {
    if (isLoading) return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage can be full or unavailable (e.g. private browsing). The app
      // keeps working in memory for the rest of the session either way.
    }
  }, [key, value, isLoading])

  return [value, setValue, isLoading]
}
