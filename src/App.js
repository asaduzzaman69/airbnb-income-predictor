import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import './App.css';
import Home from './Pages/Home';

const theme = extendTheme({
  fonts: {
    body: 'Roboto, sans-serif',
  },
  styles: {
    global: {
      body: {
        fontFamily: 'body'
      },
      a: {},
      ul: {},
      h1: {},
      p: {}

    }
  },
})

const App = () => {
  return (
    <ChakraProvider theme={theme}>


    <div className="App">
        <Home />
    </div>
    </ChakraProvider>
  );
}

export default App;
