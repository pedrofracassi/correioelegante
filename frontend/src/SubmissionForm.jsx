import React from 'react'
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
  FormLabel,
  Button
} from '@material-ui/core'

import ClassroomSelector from './ClassroomSelector.jsx'
import InstagramField from './InstagramField.jsx'

export default function SubmissionForm () {
  function sendData () {
    fetch('http://localhost/api/letter', {
      method: 'post',

    })
  }

  const [state, setState] = React.useState({
    sendAnonimously: false
  })

  const handleChange = (event) => {
    console.log(event)
    setState({ ...state, [event.target.name]: event.target.checked });
  }

  return (
    <div>
      <Grid container spacing={2}>

        <Grid item xl={12} xs={12}>
          <FormLabel component="legend">De</FormLabel>
        </Grid>
        {
          !state.sendAnonimously ? (
            <Grid item xs={12} md={8}>
              <TextField fullWidth label="Nome" variant="outlined" />       
            </Grid> 
          ): <></>
        }
        {
          !state.sendAnonimously ? (
            <Grid item xs={12} md={4}>
              <ClassroomSelector label="Turma" disabled={state.sendAnonimously} />
            </Grid>
          ) : <></>
        }
        <Grid item xl={12}>
          <FormControlLabel control={<Checkbox checked={state.sendAnonimously} />} name="sendAnonimously" onChange={handleChange} label="Anônimo" />     
        </Grid>

        <Grid item xl={12} xs={12}>
          <FormLabel component="legend">Para</FormLabel>
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField fullWidth label="Nome" variant="outlined" />       
        </Grid>
        <Grid item xs={12} md={4}>
          <ClassroomSelector label="Turma" />
        </Grid>
        <Grid item xs={12} md={12}>
           <InstagramField label="Instagram (opcional)"></InstagramField>
        </Grid>

        <Grid item xl={12} xs={12}>
          <FormLabel component="legend">Mensagem</FormLabel>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <TextField label="Mensagem" multiline rows={4} fullWidth variant="outlined" /> 
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <Button fullWidth disableElevation size="large" variant="contained" color="primary">Enviar para o feed</Button>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Button fullWidth disableElevation size="large" variant="contained" color="secondary">Enviar via direct</Button>
        </Grid>
      </Grid>
    </div>
  )
}