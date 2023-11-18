<h1 align="center">monaco-editor-component</h1>

<div align="center">

React component based on [Monaco Editor](https://github.com/Microsoft/monaco-editor).
</div>

## Installation

```bash
npm install monaco-editor-component

OR

bun install monaco-editor-component
```

## Usage

You can see the [demo](https://github.com/Talljack/monaco-editor-component/tree/main/demo) details.

```tsx
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { MonacoEditor, MonacoDiffEditor } from 'monaco-editor-component'

const App = () => {
  const [code, setCode] = useState('console.log("Hello World")')

  return (
    <div>
      <MonacoEditor language='javascript' value={code} width='300' height='500' onChange={value => setCode(value)} />
      <MonacoDiffEditor language='javascript' originalValue='const a = 123;' value={code} onChange={value => setCode(value)} />
    </div>
  )
}

const app = document.getElementById('root')
createRoot(app).render(<App />)
```

## Props

### MonacoEditor

| Name         | Type                | Default | Description                                                         |
| ------------ | ------------------- | ------- | ------------------------------------------------------------------- |
| language     | string              |   javascript      | The language of the editor.                                         |
| value        | string              |   null      | The value of the auto created model in the editor.                  |
| defaultValue | string              |    ""     | The default value of the auto created model in the editor.          |
| theme        | string              |    vs-dark     | The theme of the editor.                                            |
| options      | MonacoEditorOptions |    {}     | The options of the editor.                                          |
| onChange     | (value: string, e: monaco.editor.IModelContentChangedEvent) => void           |    noop     | An event emitted when the content of the current model has changed. |
| width        | string \| number    |    100%     | The width of the editor.                                            |
| height       | string \| number    |    100%     | The height of the editor.                                           |
| className    | string              |    ""     | The class name of the editor.                                       |
| style        | React.CSSProperties |    {}     | The style of the editor.                                            |
| onEditorDidMount | (editor: MonacoCodeEditor, monaco: Monaco) => void |    noop     | An event emitted when the editor has been mounted (similar to componentDidMount of React). |
| onEditorWillMount | (monaco: Monaco) => void |    noop     | An event emitted before the editor mounted (similar to componentWillMount of React). |
| onEditorWillUnmount | (editor: MonacoCodeEditor, monaco: Monaco) => void |    noop     | An event emitted when the editor will unmount (similar to componentWillUnmount of React). |
| modelUri | (monaco: Monaco) => monaco.Uri |     undefined    | The uri of the model. |

More **options** see [monaco-editor](https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.IStandaloneEditorConstructionOptions.html)

### MonacoDiffEditor

MonacoDiffEditor is a diff editor.

#### Props

MonacoDiffEditor extends MonacoEditor, so it has all the props of MonacoEditor but excludes the `modelUri` prop.

| Name         | Type                | Default | Description                                                         |
| ------------ | ------------------- | ------- | ------------------------------------------------------------------- |
| originalValue     | string              |    ""     | The original value of the auto created model in the editor, is a base value.         |
| originalUri | (monaco: Monaco) => monaco.Uri |    undefined     | The uri of the original model. |
| modifiedUri | (monaco: Monaco) => monaco.Uri |    undefined     | The uri of the modified model. |
| value | string |    null     | The modified value of the auto created model in the editor, is a modified value. |

### Use Editor Instance

```typescript
import { useRef } from 'react'
import type { MonacoEditorRef } from 'monaco-editor-component'
const editorRef = useRef<MonacoEditorRef>(null)

// usage
const model = editorRef.current.editor.current.getModel()
```

### Integrating the ESM version of the Monaco Editor

For Vite you only need to implement the `getWorker` function (NOT the `getWorkerUrl`) to use Vite's output.

Other's like Webpack see [monaco-editor worker](https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-esm.md)

```typescript
// Vite
// worker.ts file
import * as monaco from 'monaco-editor';

self.MonacoEnvironment = {
	getWorker: function (workerId, label) {
		const getWorkerModule = (moduleUrl, label) => {
			return new Worker(self.MonacoEnvironment.getWorkerUrl(moduleUrl), {
				name: label,
				type: 'module'
			});
		};

		switch (label) {
			case 'json':
				return getWorkerModule('/monaco-editor/esm/vs/language/json/json.worker?worker', label);
			case 'css':
			case 'scss':
			case 'less':
				return getWorkerModule('/monaco-editor/esm/vs/language/css/css.worker?worker', label);
			case 'html':
			case 'handlebars':
			case 'razor':
				return getWorkerModule('/monaco-editor/esm/vs/language/html/html.worker?worker', label);
			case 'typescript':
			case 'javascript':
				return getWorkerModule('/monaco-editor/esm/vs/language/typescript/ts.worker?worker', label);
			default:
				return getWorkerModule('/monaco-editor/esm/vs/editor/editor.worker?worker', label);
		}
	}
};

// App.tsx
import { MonacoEditor } from 'monaco-editor-component'
import './worker'

// usage of MonacoEditor...
```

## License

MIT License

Copyright (c) 2023 Yugang Cao, see the [LICENSE](LICENSE) details.
