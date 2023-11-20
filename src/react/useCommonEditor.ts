import type { MonacoCodeDiffEditor, MonacoDiffEditorProps } from '@/type'
import * as monaco from 'monaco-editor'
import { useEffect, useMemo } from 'react'
import { formatWidth } from '../utils'
export function useCommonMonacoEditor<T extends MonacoCodeDiffEditor | monaco.editor.IStandaloneCodeEditor>(
  props: Pick<MonacoDiffEditorProps, 'width' | 'height' | 'theme' | 'options'>,
  editorRef: React.RefObject<T>,
): { defaultStyle: React.CSSProperties } {
  // style
  const formatedWidth = useMemo(() => formatWidth(props.width), [props.width])
  const formatedHeight = useMemo(() => formatWidth(props.height), [props.height])
  const defaultStyle = useMemo(
    () => ({ width: formatedWidth, height: formatedHeight }),
    [formatedWidth, formatedHeight],
  )
  // watch theme
  useEffect(() => {
    if (editorRef?.current && props.theme) {
      monaco.editor.setTheme(props.theme)
    }
  }, [props.theme, editorRef])

  // watch options
  useEffect(() => {
    if (editorRef?.current) {
      editorRef.current.updateOptions(props.options ?? {})
    }
  }, [props.options, editorRef])

  // watch width & height -> editor re layout
  useEffect(() => {
    if (editorRef?.current) {
      editorRef.current.layout()
    }
  }, [formatedWidth, formatedHeight, editorRef])

  return {
    defaultStyle,
  }
}
