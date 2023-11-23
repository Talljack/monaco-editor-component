import { configureMonacoTailwindcss, tailwindcssData } from 'monaco-tailwindcss'
export const formatWidth = (width: string | number | undefined) => {
  if (!width) return '100%'
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setupTailwindcss = (monaco: any) => {
  monaco.languages.css.cssDefaults.setOptions({
    data: {
      dataProviders: {
        tailwindcssData,
      },
    },
  })

  configureMonacoTailwindcss(monaco)
}
