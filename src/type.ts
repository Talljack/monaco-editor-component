import * as monaco from 'monaco-editor'
import type { EditorLanguage } from 'monaco-editor/esm/metadata'
import type { MutableRefObject } from 'react'
import React from 'react'

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
  onEditorDidMount?: (editor: T, monaco: Monaco) => void
  onEditorWillUnmount?: (editor: T, monaco: Monaco) => void
  onEditorWillMount?: (monaco: Monaco) => U
  modelUri?: (monaco: Monaco) => monaco.Uri
}

export type MonacoCodeDiffEditor = monaco.editor.IStandaloneDiffEditor

export type MonacoCodeDiffOptions = monaco.editor.IStandaloneDiffEditorConstructionOptions

export type MonacoDiffEditorProps = Omit<MonacoEditorProps<MonacoCodeDiffEditor, MonacoCodeDiffOptions>, 'modelUri'> & {
  originalValue: string
  originalUri?: (monaco: Monaco) => monaco.Uri
  modifiedUri?: (monaco: Monaco) => monaco.Uri
}

export type MonacoDiffEditorRef = { editor: MutableRefObject<MonacoCodeDiffEditor | null> }

export type MonacoEditorRef = { editor: MutableRefObject<MonacoCodeEditor | null> }
