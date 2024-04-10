<script setup lang="ts">
import { MonacoDiffEditor, MonacoEditor } from 'monaco-editor-component/vue'
import type { Monaco, MonacoCodeEditorLanguage, MonacoCodeEditorTheme, MonacoEditorOptions } from 'monaco-editor-component/vue'
import { ref } from 'vue'
import { NInput, NSelect, NSpace } from 'naive-ui'
import './useWorker'
import type { MonacoCodeEditor } from 'monaco-editor-component'

const languages: MonacoCodeEditorLanguage[] = [
  'css',
  'dart',
  'dockerfile',
  'go',
  'graphql',
  'html',
  'java',
  'javascript',
  'json',
  'kotlin',
  'less',
  'markdown',
  'mdx',
  'mysql',
  'objective-c',
  'pgsql',
  'php',
  'powershell',
  'protobuf',
  'python',
  'redis',
  'ruby',
  'rust',
  'scala',
  'scheme',
  'scss',
  'shell',
  'sql',
  'swift',
  'typescript',
  'xml',
  'yaml',
]
const themes: MonacoCodeEditorTheme[] = ['vs', 'vs-dark', 'hc-black', 'hc-light']

const input = ref('const a = 123;')
const language = ref<MonacoCodeEditorLanguage>('javascript')
const languageOptions = languages.map(item => ({ label: item, value: item }))
const theme = ref<MonacoCodeEditorTheme>('vs-dark')
const themeOptions = themes.map(item => ({ label: item, value: item }))
const width = ref('300')
const height = ref('600')
const options = ref<MonacoEditorOptions>({
  lineNumbers: 'off',
  folding: false,
  glyphMargin: false,
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 0,
})
function handleUpdateOptions(newOptions: string) {
  try {
    options.value = JSON.parse(newOptions)
  }
  catch (error) {
    console.log('error', error)
  }
}
const monacoEditor = ref<MonacoCodeEditor | null>(null)

// eslint-disable-next-line unused-imports/no-unused-vars
function updateMonacoEditor(editor: MonacoCodeEditor, monaco: Monaco) {
  monacoEditor.value = editor
  console.log('editor', editor)
}
</script>

<template>
  <NSpace style="padding: 20px;">
    <div class="left">
      <div>
        <span>language</span>
        <NSelect v-model:value="language" :options="languageOptions" filterable />
      </div>
      <div>
        <span>theme</span>
        <NSelect v-model:value="theme" :options="themeOptions" filterable />
      </div>
      <div>
        <span>width</span>
        <NInput v-model:value="width" placeholder="Input width" />
      </div>
      <div>
        <span>height</span>
        <NInput v-model:value="height" placeholder="Input height" />
      </div>
      <div>
        <span>options</span>
        <MonacoEditor
          :value="JSON.stringify(options, null, 2)" language="json" width="300" height="200"
          :options="options" @update:value="handleUpdateOptions"
        />
      </div>
    </div>
    <MonacoEditor
      v-model:value="input" :theme="theme" :width="width" :language="language" :height="height"
      :options="options" :on-editor-will-mount="(monaco: Monaco) => {
        return {
          lineNumbers: 'on',
          folding: true,
          glyphMargin: true,
        }
      }" :on-editor-did-mount="updateMonacoEditor"
    />
    <MonacoDiffEditor
      v-model:value="input" original-value="const a = 12;" :theme="theme" :width="width"
      :language="language" :height="height" :options="options" :on-editor-will-mount="(monaco: Monaco) => {
        return {
          glyphMargin: true,
        }
      }"
    />
  </NSpace>
</template>

<style></style>
