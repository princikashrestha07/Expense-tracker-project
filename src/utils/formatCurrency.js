import { CURRENCY } from './constants'

const numberFormatter = new Intl.NumberFormat(CURRENCY.locale, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/**
 * Formats a number as a currency string, e.g. formatCurrency(1234.5) -> "Rs 1,234.50".
 *
 * @param {number} amount
 * @param {{ signed?: boolean }} [options] - When signed is true, prefixes the
 *   result with "+" for positive amounts and "-" for negative ones (the
 *   symbol always stays with the digits, e.g. "-Rs 40.00").
 */
export function formatCurrency(amount, { signed = false } = {}) {
  const safeAmount = Number.isFinite(amount) ? amount : 0
  const sign = safeAmount < 0 ? '-' : signed && safeAmount > 0 ? '+' : ''
  const formatted = numberFormatter.format(Math.abs(safeAmount))
  return `${sign}${CURRENCY.symbol} ${formatted}`
}
