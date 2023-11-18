import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { SelectValue } from '@radix-ui/react-select'
import { useState } from 'react'
import { Monaco, MonacoEditor, MonacoEditorLanguage, MonacoEditorTheme, MonacoOptions } from '../../src'
import './useWorker'

const languages: MonacoEditorLanguage[] = [
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
const themes: MonacoEditorTheme[] = ['vs', 'vs-dark', 'hc-black', 'hc-light']
function App() {
  const [input, setInput] = useState('')
  const [language, setLanguage] = useState<MonacoEditorLanguage>('javascript')
  const [theme, setTheme] = useState<MonacoEditorTheme>('vs-dark')
  const [width, setWidth] = useState('500')
  const [height, setHeight] = useState('600')
  const [options, setOptions] = useState<MonacoOptions>({
    lineNumbers: 'off',
    folding: false,
    glyphMargin: false,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 0,
  })
  return (
    <div className='App flex flex-col'>
      <h1 className='mt-8 flex justify-center font-bold'>Monaco Editor</h1>
      <div className='flex gap-6 p-10'>
        <div className='options flex h-[800px] flex-col gap-2'>
          <div className='language'>
            <Label>language</Label>
            <Select value={language} onValueChange={(newValue: MonacoEditorLanguage) => setLanguage(newValue)}>
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
            <Select value={theme} onValueChange={(newValue: MonacoEditorTheme) => setTheme(newValue)}>
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
        <MonacoEditor
          value={input}
          onChange={newVal => {
            setInput(newVal)
          }}
          language={language}
          theme={theme}
          className='ml-4 flex'
          width={width}
          height={height}
          options={options}
          onEditorWillMount={(monaco: Monaco) => {
            console.log('monaco', monaco)
            return {
              lineNumbers: 'on',
              glyphMargin: true,
            }
          }}
          onEditorDidMount={editor => {
            console.log('editor', editor)
          }}
        />
      </div>
    </div>
  )
}

export default App
