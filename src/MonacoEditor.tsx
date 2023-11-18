import * as monaco from 'monaco-editor'
import type { EditorLanguage } from 'monaco-editor/esm/metadata'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
import { useCommonMonacoEditor } from './useCommonEditor'
import { noop } from './utils'

export type Monaco = typeof monaco

export type MonacoCodeEditor = monaco.editor.IStandaloneCodeEditor

export type MonacoCodeEditorLanguage = EditorLanguage

export type MonacoCodeEditorTheme = monaco.editor.BuiltinTheme

export type MonacoEditorOptions = monaco.editor.IStandaloneEditorConstructionOptions

export interface MonacoEditorProps<T = MonacoCodeEditor, U = MonacoEditorOptions> {
  value: string | null
  className?: string
  options?: U
  width?: string | number
  height?: string | number
  language?: EditorLanguage
  theme?: monaco.editor.BuiltinTheme
  style?: React.CSSProperties
  onChange?: (value: string, e: monaco.editor.IModelContentChangedEvent) => void
  defaultValue?: string
  onEditorDidMount?: (editor: T) => void
  onEditorWillUnmount?: (editor: T) => void
  onEditorWillMount?: (monaco: Monaco) => U
  modelUri?: (monaco: Monaco) => monaco.Uri
}

const MonacoEditor: FC<MonacoEditorProps> = ({
  value = null,
  className = '',
  options = {},
  width = '100%',
  height = '100%',
  language = 'javascript',
  theme = 'vs-dark',
  style = {},
  onChange = noop,
  defaultValue = '',
  onEditorDidMount = noop,
  onEditorWillUnmount = noop,
  onEditorWillMount = noop,
  modelUri,
}) => {
  // const [editor, setEditor] = useState<MonacoCodeEditor | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<MonacoCodeEditor | null>(null)
  const { defaultStyle } = useCommonMonacoEditor<MonacoCodeEditor>(
    {
      width,
      height,
      theme,
      options,
    },
    editorRef,
  )
  const handleMonacoEditorMounted = (editor: MonacoCodeEditor) => {
    onEditorDidMount(editor)
    editor.onDidChangeModelContent(e => {
      const newValue = editor.getValue()
      onChange?.(newValue, e)
    })
  }

  useEffect(() => {
    if (containerRef) {
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
      editorRef.current = monaco.editor.create(containerRef.current!, {
        model,
        value: value ?? defaultValue,
        ...{ ...options, ...userOptions },
        theme,
        language,
      })
      // mount hook
      handleMonacoEditorMounted(editorRef.current)
    }

    return () => {
      onEditorWillUnmount(editorRef.current!)
      editorRef.current?.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef])
  // watch language
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel()
      if (model) {
        monaco.editor.setModelLanguage(model, language)
      }
    }
  }, [language])

  // watch value
  useEffect(() => {
    if (editorRef.current) {
      if (value === editorRef.current.getValue()) return
      const model = editorRef.current.getModel()
      if (model) {
        model.setValue(value ?? '')
      }
    }
  }, [value])
  return <div ref={containerRef} className={className} style={{ ...defaultStyle, ...style }} />
}

export default MonacoEditor
