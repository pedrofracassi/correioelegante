import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import Home from './Home.jsx'
import { ThemeProvider, Container } from '@material-ui/core'

function App() {
  return (
    <ThemeProvider>
      <Container maxWidth="md">
        <Router>
          <Switch>
            <Route path="/admin">
              <h1>Painel Administrativo</h1>
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </Container>
    </ThemeProvider>
  )
}

export default App
