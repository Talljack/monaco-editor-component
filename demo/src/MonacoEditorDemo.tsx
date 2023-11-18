import { useState } from 'react'
import { MonacoEditor } from '../../src/index'
import './useWorker'

const CodeEditor = () => {
  const [input, setInput] = useState('')
  const [output] = useState('')

  return (
    <div>
      <div className='flex items-center justify-between gap-6'>
        <MonacoEditor value={input} onChange={setInput} className='ml-4 flex' width='500px' height='800px' />
        <MonacoEditor
          className='mr-4 flex'
          value={output}
          options={{
            readOnly: true,
          }}
          width='500px'
          height='800px'
        />
      </div>
    </div>
  )
}

export default CodeEditor
