import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const theme = extendTheme({ colors })

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>,
  document.getElementById('root'),
)
