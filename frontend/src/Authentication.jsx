import React, { useState } from 'react'

import {
  Container,
  Button,
  TextField,
  CircularProgress
} from "@material-ui/core"

import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
  margin: {
    marginTop: 20,
  }
})

export default function Authentication () {
  const classes = useStyles()

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('')
  const [error, setError] = useState('')

  function login () {
    setLoading(true)
    fetch(`${process.env.REACT_APP_API_PATH}/users/@me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.json()).then(json => {
      if (json.token) {
        localStorage.setItem('user', JSON.stringify(json))
        window.location.reload()
      }
    }).catch(err => {
      setLoading(false)
      setError('Token inválido')
    })
  }

  function handleTokenChange (event) {
    setToken(event.target.value)
  }

  return (
    <Container maxWidth="xs" height="100%">
      <TextField
        className={classes.margin}
        error={error}
        helperText={error}
        fullWidth
        id="outlined-error-helper-text"
        label="Token"
        variant="outlined"
        value={token}
        disabled={loading}
        onChange={handleTokenChange}
      />
      <Button className={classes.margin} disabled={loading} onClick={() => login()} variant="contained" disableElevation color="primary" size="large" fullWidth>
        {
          !loading ? (
            'Login'
          ) : (
            <CircularProgress color="inherit" size={25}/>
          )
        }
      </Button>
    </Container>
  )
}
