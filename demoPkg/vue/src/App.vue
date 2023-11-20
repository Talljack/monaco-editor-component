<script setup lang="ts">
import { MonacoEditor, MonacoDiffEditor } from '../../../src/vue/index'
import type { MonacoCodeEditorLanguage, MonacoCodeEditorTheme, MonacoEditorOptions, Monaco } from '../../../src/vue/index'
import { ref } from 'vue'
import { NInput, NSelect, NSpace } from 'naive-ui'
import "./useWorker"
import { MonacoCodeEditor } from '../../../src/type';

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
const languageOptions = languages.map((item) => ({ label: item, value: item }))
const theme = ref('vs-dark')
const themeOptions = themes.map((item) => ({ label: item, value: item }))
const width = ref('300')
const height = ref('600')
const options = ref<MonacoEditorOptions>({
  lineNumbers: 'off',
  folding: false,
  glyphMargin: false,
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 0,
})
const handleUpdateOptions = (newOptions: string) => {
  try {
    options.value = JSON.parse(newOptions)
  } catch (error) {
    console.log('error', error)
  }
}
const monacoEditor = ref<MonacoCodeEditor | null>(null)

const updateMonacoEditor = (editor: MonacoCodeEditor, monaco: Monaco) => {
  monacoEditor.value = editor
  console.log('editor', editor)
}
</script>

<template>
  <NSpace style="padding: 20px;">
    <div class="left">
      <div>
        <span>language</span>
        <NSelect :options='languageOptions' v-model:value="language" filterable />
      </div>
      <div>
        <span>theme</span>
        <NSelect :options='themeOptions' v-model:value="theme" filterable />
      </div>
      <div>
        <span>width</span>
        <NInput placeholder="Input width" v-model:value="width" />
      </div>
      <div>
        <span>height</span>
        <NInput placeholder="Input height" v-model:value="height" />
      </div>
      <div>
        <span>options</span>
        <MonacoEditor :value="JSON.stringify(options, null, 2)" @update:value="handleUpdateOptions" language="json"
          width="300" height="200" :options="options" />
      </div>
    </div>
    <MonacoEditor v-model:value="input" :theme="theme" :width="width" :language="language" :height="height"
      :options="options" ref="monacoEditorRef" :onEditorWillMount="(monaco: Monaco) => {
        return {
          lineNumbers: 'on',
          folding: true,
          glyphMargin: true,
        }
      }" :onEditorDidMount="updateMonacoEditor" />
    <MonacoDiffEditor v-model:value="input" originalValue="const a = 12;" :theme="theme" :width="width"
      :language="language" :height="height" :options="options" :onEditorWillMount="(monaco: Monaco) => {
        return {
          glyphMargin: true,
        }
      }" />
  </NSpace>
</template>

<style>
</style>
