export const formatWidth = (width: string | number) => {
  if (typeof width === 'number') {
    return `${width}px`
  }
  if (width.endsWith('%')) {
    return width
  }
  if (width.endsWith('px') || width.endsWith('vw')) {
    return width
  } else {
    return `${width}px`
  }
}

export const noop = () => {}
