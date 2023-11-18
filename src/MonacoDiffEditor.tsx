import * as monaco from 'monaco-editor'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import type { Monaco, MonacoEditorProps } from './MonacoEditor'
import { useCommonMonacoEditor } from './useCommonEditor'
import { noop } from './utils'

export type MonacoCodeDiffEditor = monaco.editor.IStandaloneDiffEditor

export type MonacoCodeDiffOptions = monaco.editor.IStandaloneDiffEditorConstructionOptions

export type MonacoDiffEditorProps = Omit<MonacoEditorProps<MonacoCodeDiffEditor, MonacoCodeDiffOptions>, 'modelUri'> & {
  originalValue: string
  originalUri?: (monaco: Monaco) => monaco.Uri
  modifiedUri?: (monaco: Monaco) => monaco.Uri
}

const MonacoDiffEditor: FC<MonacoDiffEditorProps> = ({
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
}) => {
  const [editor, setEditor] = useState<MonacoCodeDiffEditor | null>(null)
  // common effect
  const { editorRef, defaultStyle } = useCommonMonacoEditor<MonacoCodeDiffEditor>(
    {
      width,
      height,
      theme,
      options,
    },
    editor,
  )
  const handleMonacoEditorMounted = (editor: MonacoCodeDiffEditor) => {
    onEditorDidMount(editor)
    const modifiedModel = editor.getModel()?.modified
    if (!modifiedModel) return
    modifiedModel.onDidChangeContent(e => {
      const newValue = modifiedModel.getValue()
      onChange?.(newValue, e)
    })
  }
  useEffect(() => {
    if (editorRef) {
      setEditor(editor => {
        if (editor) return editor
        // editor will mount hook
        const userOptions = onEditorWillMount?.(monaco)
        // modelUri
        const originalModelUri = originalUri?.(monaco)
        const modifiedModelUri = modifiedUri?.(monaco)
        let originalModel = originalModelUri ? monaco.editor.getModel(originalModelUri) : null
        if (!originalModel) {
          originalModel = monaco.editor.createModel(originalValue ?? defaultValue, language, originalModelUri)
        } else {
          originalModel.setValue(originalValue ?? defaultValue)
          monaco.editor.setModelLanguage(originalModel, language)
        }
        let modifiedModel = modifiedModelUri ? monaco.editor.getModel(modifiedModelUri) : null
        if (!modifiedModel) {
          modifiedModel = monaco.editor.createModel(value ?? defaultValue, language, originalModelUri)
        } else {
          modifiedModel.setValue(value ?? defaultValue)
          monaco.editor.setModelLanguage(modifiedModel, language)
        }
        const monacoEditor = monaco.editor.createDiffEditor(editorRef.current!, {
          ...{ ...options, ...userOptions },
          theme,
        })
        monacoEditor.setModel({
          original: originalModel,
          modified: modifiedModel,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorRef])
  // watch language
  useEffect(() => {
    if (editor) {
      // update every model language
      const originalModel = editor.getModel()?.original
      const modifiedModel = editor.getModel()?.modified
      if (originalModel) {
        monaco.editor.setModelLanguage(originalModel, language)
      }
      if (modifiedModel) {
        monaco.editor.setModelLanguage(modifiedModel, language)
      }
    }
  }, [language, editor])

  // watch originalValue
  useEffect(() => {
    if (editor) {
      const model = editor.getModel()?.original
      if (originalValue === model?.getValue()) return
      if (model) {
        model.setValue(originalValue ?? '')
      }
    }
  }, [originalValue, editor])
  // watch value
  useEffect(() => {
    if (editor) {
      const model = editor.getModel()?.modified
      if (value === model?.getValue()) return
      if (model) {
        model.setValue(value ?? '')
      }
    }
  }, [value, editor])
  return <div ref={editorRef} className={className} style={{ ...defaultStyle, ...style }}></div>
}

export default MonacoDiffEditor
