import { configureMonacoTailwindcss, tailwindcssData } from 'monaco-tailwindcss'
import type { Monaco } from './index'
export const setupTailwindcss = (monaco: Monaco) => {
  monaco.languages.css.cssDefaults.setOptions({
    data: {
      dataProviders: {
        tailwindcssData,
      },
    },
  })

  configureMonacoTailwindcss(monaco)
}
