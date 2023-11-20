import type { MonacoCodeDiffEditor, MonacoDiffEditorProps } from '@/type'
import * as monaco from 'monaco-editor'
import { computed, nextTick, watch } from 'vue'
import { formatWidth } from '../utils'
export function useCommonMonacoEditor<T extends MonacoCodeDiffEditor | monaco.editor.IStandaloneCodeEditor>(
  props: Pick<MonacoDiffEditorProps, 'width' | 'height' | 'theme' | 'options'>,
  editor: T,
) {
  const formatedWidth = computed(() => formatWidth(props.width))
  const formatedHeight = computed(() => formatWidth(props.height))
  // style
  const defaultStyle = computed(() => {
    console.log('xxxx', formatedWidth.value, editor)
    return {
      width: formatedWidth.value,
      height: formatedHeight.value,
    }
  })
  // watch theme
  watch(
    () => props.theme,
    newTheme => {
      if (editor && newTheme) {
        monaco.editor.setTheme(newTheme)
      }
    },
  )

  // watch options
  watch(
    () => props.options,
    newOptions => {
      if (editor) {
        editor.updateOptions(newOptions ?? {})
      }
    },
    {
      deep: true,
    },
  )

  // watch width & height -> editor re layout
  watch(
    () => [formatedWidth.value, formatedHeight.value],
    () => {
      console.log('editor', editor)
      if (editor) {
        nextTick(() => {
          console.log('watch width change')

          editor.layout()
        })
      }
    },
  )

  return {
    defaultStyle,
  }
}
