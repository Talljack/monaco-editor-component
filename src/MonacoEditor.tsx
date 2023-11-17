import { formatWidth } from '@/utils'
import * as monaco from 'monaco-editor'
import type { EditorLanguage } from 'monaco-editor/esm/metadata'
import type { FC } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

export interface MonacoEditorProps {
  className?: string
  options: monaco.editor.IStandaloneEditorConstructionOptions
  width: string | number
  height: string | number
  language: EditorLanguage
  theme: monaco.editor.BuiltinTheme
  style?: React.CSSProperties
}

const MonacoEditor: FC<MonacoEditorProps> = ({
  className = '',
  options,
  width,
  height,
  language,
  theme,
  style = {},
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null)

  // style
  const formatedWidth = formatWidth(width)
  const formatedHeight = formatWidth(height)
  const defaultStyle = useMemo(
    () => ({ width: formatedWidth, height: formatedHeight }),
    [formatedWidth, formatedHeight],
  )

  useEffect(() => {
    if (editorRef) {
      setEditor(editor => {
        if (editor) return editor

        return monaco.editor.create(editorRef.current!, {
          value: options.value || '',
          ...options,
          language,
          theme,
        })
      })
    }

    return () => editor?.dispose()
    // react-hooks/exhaustive-deps
  }, [editorRef, editor])
  return (
    <div>
      <div ref={editorRef} className={className} style={{ ...defaultStyle, ...style }} />
    </div>
  )
}

export default MonacoEditor
