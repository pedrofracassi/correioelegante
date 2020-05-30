import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import Home from './Home.jsx'

function App() {
  return (
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
  )
}

export default App
