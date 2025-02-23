import { FunctionComponent } from 'react'
import InputWithUnit from './components/InputWithUnit'
import { lightTheme } from '@storyblok/mui'
import { CssBaseline, Button, ThemeProvider } from '@mui/material'

const App: FunctionComponent = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <InputWithUnit />
    </ThemeProvider>
  )
}

export default App
