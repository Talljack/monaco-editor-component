import * as monaco from 'monaco-editor'
import { useEffect, useMemo, useRef } from 'react'
import type { MonacoCodeDiffEditor, MonacoDiffEditorProps } from './MonacoDiffEditor'
import { formatWidth } from './utils'
export function useCommonMonacoEditor<T extends MonacoCodeDiffEditor | monaco.editor.IStandaloneCodeEditor>(
  props: Pick<MonacoDiffEditorProps, 'width' | 'height' | 'theme' | 'options'>,
  editor: T | null,
): { editorRef: React.RefObject<HTMLDivElement>; defaultStyle: React.CSSProperties } {
  const editorRef = useRef<HTMLDivElement>(null)
  // style
  const formatedWidth = useMemo(() => formatWidth(props.width), [props])
  const formatedHeight = useMemo(() => formatWidth(props.height), [props.height])
  const defaultStyle = useMemo(
    () => ({ width: formatedWidth, height: formatedHeight }),
    [formatedWidth, formatedHeight],
  )
  // watch theme
  useEffect(() => {
    if (editor && props.theme) {
      monaco.editor.setTheme(props.theme)
    }
  }, [props.theme, editor])

  // watch options
  useEffect(() => {
    if (editor) {
      editor.updateOptions(props.options ?? {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.options])

  // watch width & height
  useEffect(() => {
    if (editor) {
      editor.layout()
    }
  }, [formatedWidth, formatedHeight, editor])

  return {
    editorRef,
    defaultStyle,
  }
}
