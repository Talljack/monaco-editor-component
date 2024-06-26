import * as monaco from 'monaco-editor'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { noop } from '../utils'
import { useCommonMonacoEditor } from './useCommonEditor'
import type { MonacoCodeDiffEditor, MonacoDiffEditorProps, MonacoDiffEditorRef } from '@/type'

const MonacoDiffEditor = forwardRef<MonacoDiffEditorRef, MonacoDiffEditorProps>(
  (
    {
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
      originalValue = '',
      originalUri,
      modifiedUri,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const editorRef = useRef<MonacoCodeDiffEditor | null>(null)
    // common effect
    const { defaultStyle } = useCommonMonacoEditor<MonacoCodeDiffEditor>(
      {
        width,
        height,
        theme,
        options,
      },
      editorRef,
    )
    const handleMonacoEditorMounted = (editor: MonacoCodeDiffEditor) => {
      onEditorDidMount(editor, monaco)
      const modifiedModel = editor.getModel()?.modified
      if (!modifiedModel)
        return
      modifiedModel.onDidChangeContent((e) => {
        const newValue = modifiedModel.getValue()
        onChange?.(newValue, e)
      })
    }
    useEffect(() => {
      if (containerRef) {
        // editor will mount hook
        const userOptions = onEditorWillMount?.(monaco)
        // modelUri
        const originalModelUri = originalUri?.(monaco)
        const modifiedModelUri = modifiedUri?.(monaco)
        let originalModel = originalModelUri ? monaco.editor.getModel(originalModelUri) : null
        if (!originalModel) {
          originalModel = monaco.editor.createModel(originalValue ?? defaultValue, language, originalModelUri)
        }
        else {
          originalModel.setValue(originalValue ?? defaultValue)
          monaco.editor.setModelLanguage(originalModel, language)
        }
        let modifiedModel = modifiedModelUri ? monaco.editor.getModel(modifiedModelUri) : null
        if (!modifiedModel) {
          modifiedModel = monaco.editor.createModel(value ?? defaultValue, language, originalModelUri)
        }
        else {
          modifiedModel.setValue(value ?? defaultValue)
          monaco.editor.setModelLanguage(modifiedModel, language)
        }
        editorRef.current = monaco.editor.createDiffEditor(containerRef.current!, {
          ...{ ...options, ...userOptions },
          theme,
        })
        editorRef.current.setModel({
          original: originalModel,
          modified: modifiedModel,
        })
        // mount hook
        handleMonacoEditorMounted(editorRef.current)
      }

      return () => {
        onEditorWillUnmount(editorRef.current!, monaco)
        editorRef.current?.dispose()
      }
      // react-hooks/exhaustive-deps
    }, [editorRef])
    // watch language
    useEffect(() => {
      if (editorRef.current) {
        // update every model language
        const originalModel = editorRef.current.getModel()?.original
        const modifiedModel = editorRef.current.getModel()?.modified
        if (originalModel)
          monaco.editor.setModelLanguage(originalModel, language)

        if (modifiedModel)
          monaco.editor.setModelLanguage(modifiedModel, language)
      }
    }, [language])

    // watch originalValue
    useEffect(() => {
      if (editorRef.current) {
        const model = editorRef.current.getModel()?.original
        if (originalValue === model?.getValue())
          return
        if (model)
          model.setValue(originalValue ?? '')
      }
    }, [originalValue])
    // watch value
    useEffect(() => {
      if (editorRef.current) {
        const model = editorRef.current.getModel()?.modified
        if (value === model?.getValue())
          return
        if (model)
          model.setValue(value ?? '')
      }
    }, [value])
    useImperativeHandle(ref, () => ({
      editor: editorRef,
    }))
    window.addEventListener('resize', () => {
      editorRef.current?.layout()
    })
    return <div ref={containerRef} className={className} style={{ ...defaultStyle, ...style }}></div>
  },
)

export default MonacoDiffEditor
