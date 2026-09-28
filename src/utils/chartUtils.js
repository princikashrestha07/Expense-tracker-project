/**
 * Turns category totals into donut slices: each gets its share of the
 * circle as a start/end percentage, running cumulatively from 0.
 */
export function buildDonutSegments(categoryTotals) {
  const total = categoryTotals.reduce((sum, c) => sum + c.amount, 0)
  let cumulative = 0
  return categoryTotals.map((c) => {
    const percent = total > 0 ? (c.amount / total) * 100 : 0
    const start = cumulative
    cumulative += percent
    return { ...c, percent, start, end: cumulative }
  })
}

/** CSS conic-gradient string for a set of donut segments. */
export function buildConicGradient(segments) {
  if (segments.length === 0) return 'none'
  const stops = segments.map((s) => `${s.color} ${s.start}% ${s.end}%`)
  return `conic-gradient(${stops.join(', ')})`
}
