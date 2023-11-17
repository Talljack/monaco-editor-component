# React Monaco Editor and Viewer

This is a React component for the Monaco Editor and Viewer.

Base on [monaco-editor](https://github.com/microsoft/monaco-editor)

## Installation

```bash
npm install react-monaco-editor monaco-editor

OR

bun install react-monaco-editor monaco-editor
```

## Usage

```tsx
import React, { useState } from 'react'
import { MonacoEditor, MonacoViewer } from 'react-monaco-editor'

const App = () => {
  const [code, setCode] = useState('console.log("Hello World")')

  return (
    <div>
      <MonacoEditor language='javascript' value={code} onChange={value => setCode(value)} />
      <MonacoViewer language='javascript' value={code} />
    </div>
  )
}

const app = document.getElementById('app')
ReactDOM.render(<App />, app)
```

## Props

参见 [monaco-editor](https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.IStandaloneEditorConstructionOptions.html)

### MonacoEditor

| Name     | Type     | Default | Description                                                         |
| -------- | -------- | ------- | ------------------------------------------------------------------- |
| language | string   |         | The language of the editor.                                         |
| value    | string   |         | The initial value of the auto created model in the editor.          |
| theme    | string   |         | The theme of the editor.                                            |
| options  | object   |         | The options of the editor.                                          |
| onChange | function |         | An event emitted when the content of the current model has changed. |

### MonacoViewer

| Name     | Type   | Default | Description                                                |
| -------- | ------ | ------- | ---------------------------------------------------------- |
| language | string |         | The language of the editor.                                |
| value    | string |         | The initial value of the auto created model in the editor. |
| theme    | string |         | The theme of the editor.                                   |
| options  | object |         | The options of the editor.                                 |

## License

MIT License

Copyright (c) 2023 Yugang Cao
