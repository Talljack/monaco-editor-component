export function formatWidth(width: string | number | undefined) {
  if (!width) return '100%'
  if (typeof width === 'number') return `${width}px`

  if (width.endsWith('%')) return width

  if (width.endsWith('px') || width.endsWith('vw')) return width
  else return `${width}px`
}

export function noop() {}
