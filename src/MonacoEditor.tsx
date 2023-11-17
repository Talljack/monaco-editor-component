import { formatWidth, noop } from '@/utils'
import * as monaco from 'monaco-editor'
import type { EditorLanguage } from 'monaco-editor/esm/metadata'
import type { FC } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

export type Monaco = typeof monaco

export interface MonacoEditorProps {
  value: string | null
  className?: string
  options: monaco.editor.IStandaloneEditorConstructionOptions
  width: string | number
  height: string | number
  language: EditorLanguage
  theme: monaco.editor.BuiltinTheme
  style?: React.CSSProperties
  onChange?: (value: string, e: monaco.editor.IModelContentChangedEvent) => void
  defaultValue?: string
  onEditorDidMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void
  onEditorWillUnmount?: (editor: monaco.editor.IStandaloneCodeEditor) => void
  onEditorWillMount?: (monaco: Monaco) => monaco.editor.IStandaloneEditorConstructionOptions
  modelUri?: (monaco: Monaco) => monaco.Uri
}

const MonacoEditor: FC<MonacoEditorProps> = ({
  value = null,
  className = '',
  options,
  width,
  height,
  language,
  theme,
  style = {},
  onChange = noop,
  defaultValue = '',
  onEditorDidMount = noop,
  onEditorWillUnmount = noop,
  onEditorWillMount = noop,
  modelUri = () => monaco.Uri.parse(''),
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null)

  // style
  const formatedWidth = useMemo(() => formatWidth(width), [width])
  const formatedHeight = useMemo(() => formatWidth(height), [height])
  const defaultStyle = useMemo(
    () => ({ width: formatedWidth, height: formatedHeight }),
    [formatedWidth, formatedHeight],
  )

  const handleMonacoEditorMounted = (editor: monaco.editor.IStandaloneCodeEditor) => {
    onEditorDidMount(editor)
    editor.onDidChangeModelContent(e => {
      const value = editor.getValue()
      onChange?.(value, e)
    })
  }

  useEffect(() => {
    if (editorRef) {
      setEditor(editor => {
        if (editor) return editor
        // editor will mount hook
        const userOptions = onEditorWillMount?.(monaco)
        // modelUri
        const uri = modelUri?.(monaco)
        let model = uri ? monaco.editor.getModel(uri) : null
        if (!model) {
          model = monaco.editor.createModel(value ?? defaultValue, language, uri)
        } else {
          // update value and language use same model
          model.setValue(value ?? defaultValue)
          monaco.editor.setModelLanguage(model, language)
        }
        const monacoEditor = monaco.editor.create(editorRef.current!, {
          model,
          value: value ?? defaultValue,
          ...{ ...options, ...userOptions },
          language,
          theme,
        })
        // mount hook
        handleMonacoEditorMounted(monacoEditor)
        return monacoEditor
      })
    }

    return () => {
      onEditorWillUnmount(editor!)
      editor?.dispose()
    }
    // react-hooks/exhaustive-deps
  }, [editorRef])
  // watch language
  useEffect(() => {
    if (editor) {
      const model = editor.getModel()
      if (model) {
        monaco.editor.setModelLanguage(model, language)
      }
    }
  }, [language])
  // watch theme
  useEffect(() => {
    if (editor) {
      monaco.editor.setTheme(theme)
    }
  }, [theme])

  // watch options
  useEffect(() => {
    if (editor) {
      editor.updateOptions(options)
    }
  }, [options])

  // watch width & height
  useEffect(() => {
    if (editor) {
      editor.layout()
    }
  }, [formatedWidth, formatedHeight])
  return (
    <div>
      <div ref={editorRef} className={className} style={{ ...defaultStyle, ...style }} />
    </div>
  )
}

export default MonacoEditor
