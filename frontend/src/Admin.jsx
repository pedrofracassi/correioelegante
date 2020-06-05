import React from 'react';

import { makeStyles } from "@material-ui/core/styles"

import {
  AppBar,
  Container,
  Tabs,
  Tab
} from "@material-ui/core"

import LetterList from "./LetterList.jsx"
import Authentication from './Authentication.jsx';

const useStyles = makeStyles({
  container: {
    marginTop: 60,
  }
})

export default function Admin ({ filter }) {
  const classes = useStyles()

  function logout() {
    localStorage.removeItem('user')
    window.location.reload()
  }

  return (
    <div>
      {
        localStorage.getItem('user') ? (
          <div>
            <AppBar>
              <Tabs centered>
                <Tab label="Entrada" component="a" href="../admin"/>
                <Tab label="Aguardando envio"  component="a" href="../admin/approved"/>
                <Tab label="Reprovadas"  component="a" href="../admin/denied"/>
                <Tab label="Entregues"  component="a" href="../admin/delivered"/>
                <Tab label="Sair" onClick={logout} />
              </Tabs>
            </AppBar>
            <Container className={classes.container}>
              <LetterList status={filter} />
            </Container>
          </div>
        ) : (
          <Authentication />
        )
      }
    </div>
  )
}
