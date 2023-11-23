import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { SelectValue } from '@radix-ui/react-select'
import type {
  Monaco,
  MonacoCodeEditorLanguage,
  MonacoCodeEditorTheme,
  MonacoEditorOptions,
  MonacoEditorRef,
} from 'monaco-editor-component/react'
import { MonacoDiffEditor, MonacoEditor } from 'monaco-editor-component/react'
import { useRef, useState } from 'react'
import './useWorker'

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
function App() {
  const [input, setInput] = useState('')
  const [language, setLanguage] = useState<MonacoCodeEditorLanguage>('javascript')
  const [theme, setTheme] = useState<MonacoCodeEditorTheme>('vs-dark')
  const [width, setWidth] = useState('500')
  const [height, setHeight] = useState('600')
  const [options, setOptions] = useState<MonacoEditorOptions>({
    lineNumbers: 'off',
    folding: false,
    glyphMargin: false,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 0,
  })
  const editor = useRef<MonacoEditorRef>(null)

  console.log('editor', editor)
  setTimeout(() => {
    console.log('editor', editor.current?.editor.current)
  }, 2000)
  return (
    <div className='App flex flex-col'>
      <h1 className='mt-4 flex justify-center font-bold'>Monaco Editor Demo</h1>
      <div className='flex gap-6 p-10'>
        <div className='options flex h-[800px] flex-col gap-2'>
          <div className='language'>
            <Label>language</Label>
            <Select value={language} onValueChange={(newValue: MonacoCodeEditorLanguage) => setLanguage(newValue)}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Please Select' />
              </SelectTrigger>
              <SelectContent>
                {languages?.map((language, index) => (
                  <SelectItem key={index} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='theme'>
            <Label>theme</Label>
            <Select value={theme} onValueChange={(newValue: MonacoCodeEditorTheme) => setTheme(newValue)}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Please Select' />
              </SelectTrigger>
              <SelectContent>
                {themes?.map((theme, index) => (
                  <SelectItem key={index} value={theme}>
                    {theme}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='width'>
            <Label>width</Label>
            <Input
              value={width}
              onChange={e => {
                setWidth(e.target.value)
              }}
            />
          </div>
          <div className='height'>
            <Label>height</Label>
            <Input
              value={height}
              onChange={e => {
                setHeight(e.target.value)
              }}
            />
          </div>
          <div className='options'>
            <Label>options</Label>
            <MonacoEditor
              value={JSON.stringify(options, null, 2)}
              onChange={newVal => {
                console.log('xxxx', newVal)
                try {
                  setOptions(JSON.parse(newVal))
                } catch (error) {
                  console.log('error', error)
                }
              }}
              language='json'
              width={300}
              height={200}
              options={options}
            />
          </div>
        </div>
        <div>
          <Label>Monaco Editor</Label>
          <MonacoEditor
            value={input}
            onChange={newVal => {
              setInput(newVal)
            }}
            ref={editor}
            language={language}
            theme={theme}
            className='ml-4 flex'
            width={width}
            height={height}
            options={options}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onEditorWillMount={(monaco: Monaco) => {
              return {
                lineNumbers: 'on',
                folding: true,
                glyphMargin: true,
              }
            }}
          />
        </div>
        <div>
          <Label>Monaco Diff Editor</Label>
          <MonacoDiffEditor
            value={input}
            originalValue={'const a = 1;'}
            language={language}
            theme={theme}
            onChange={newValue => {
              setInput(newValue)
            }}
            options={options}
            width={width}
            height={height}
            onEditorWillMount={() => {
              return {
                glyphMargin: true,
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default App
