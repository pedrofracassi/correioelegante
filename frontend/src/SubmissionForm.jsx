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
  const [state, setState] = React.useState({
    fromName: '',
    fromClassroom: '',
    fromIsAnonymous: false,
    toName: '',
    toClassroom: '',
    toInstagram: '',
    messageContent: ''
  })

  function handleChange(event) {
    console.log(event.target.name, event.target.value)
    setState({ ...state, [event.target.name]: event.target.value });
  }

  function handleCheckboxChange(event) {
    setState({ ...state, [event.target.name]: event.target.checked });
  }

  function sendData () {
    fetch('http://localhost:80/letters').then(res => res.json()).then(console.log)
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xl={12} xs={12}>
          <FormLabel component="legend">De</FormLabel>
        </Grid>
        {
          !state.fromIsAnonymous ? (
            <Grid item xs={12} md={8}>
              <TextField fullWidth label="Nome" variant="outlined" value={state.fromName} onChange={handleChange} name="fromName" />       
            </Grid> 
          ): <></>
        }
        {
          !state.fromIsAnonymous ? (
            <Grid item xs={12} md={4}>
              <ClassroomSelector label="Turma" value={state.fromClassroom} onChange={handleChange} name="fromClassroom" />
            </Grid>
          ) : <></>
        }
        <Grid item xl={12}>
          <FormControlLabel control={<Checkbox checked={state.fromIsAnonymous} name="fromIsAnonymous" onChange={handleCheckboxChange}/>} label="Anônimo" />     
        </Grid>

        <Grid item xl={12} xs={12}>
          <FormLabel component="legend">Para</FormLabel>
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField fullWidth label="Nome" variant="outlined" value={state.toName} onChange={handleChange} name="toName" />       
        </Grid>
        <Grid item xs={12} md={4}>
          <ClassroomSelector label="Turma" value={state.toClassroom} onChange={handleChange} name="toClassroom" />
        </Grid>
        <Grid item xs={12} md={12}>
           <InstagramField label="Instagram (opcional)" maxWidth variant="outlined" value={state.toInstagram} onChange={handleChange} name="toInstagram" />
        </Grid>

        <Grid item xl={12} xs={12}>
          <FormLabel component="legend">Mensagem</FormLabel>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <TextField label="Mensagem" multiline rows={4} fullWidth variant="outlined" value={state.messageContent} onChange={handleChange} name="messageContent" /> 
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <Button fullWidth disableElevation size="large" variant="contained" color="primary" onClick={sendData}>Enviar para o feed</Button>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Button fullWidth disableElevation size="large" variant="contained" color="secondary">Enviar via direct</Button>
        </Grid>
      </Grid>
    </div>
  )
}