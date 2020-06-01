import React, {useState} from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import Home from './Home.jsx'
import { ThemeProvider, Container } from '@material-ui/core'
import Snackbar from "@material-ui/core/Snackbar"
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Button from "@material-ui/core/Button";

function App() {
  const [snackBar, setSnackBar] = useState('')

  const openSimpleSnackBar = text => {
    setSnackBar(text)
  }

  return (
    <ThemeProvider>
      <Container maxWidth="md">
        <Router>
          <Switch>
            <Route path="/admin">
              <h1>Painel Administrativo</h1>
            </Route>
            <Route path="/">
              <Home openSimpleSnackBar={openSimpleSnackBar} />
            </Route>
          </Switch>
        </Router>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={!!snackBar}
          autoHideDuration={6000}
          onClose={() => setSnackBar('')}
          message={snackBar}
          action={
            <React.Fragment>
              <Button color="secondary" size="small" onClick={() => setSnackBar('')}>
                FECHAR
              </Button>
              <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackBar('')}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </Container>
    </ThemeProvider>
  )
}

export default App
