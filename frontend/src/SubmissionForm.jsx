import React, {useState} from 'react'

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
import Collapse from "@material-ui/core/Collapse";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

const initialValues = {
  fromName: '',
  fromClassroom: '',
  fromIsAnonymous: false,
  toName: '',
  toClassroom: '',
  toInstagram: '',
  messageContent: ''
}

export default function SubmissionForm({openSimpleSnackBar, onComplete}) {
  const [state, setState] = React.useState(initialValues)

  const initialHelpMessages = {
    fromName: '',
    fromClassroom: '',
    fromIsAnonymous: '',
    toName: '',
    toClassroom: '',
    messageContent: ''
  }

  const [helpMessages, setHelpMessages] = useState(initialHelpMessages)
  const [loading, setLoading] = useState('')

  function handleChange(event) {
    setState({...state, [event.target.name]: event.target.value});
  }

  function handleCheckboxChange(event) {
    setState({...state, [event.target.name]: event.target.checked});
  }

  const validate = (direct) => {
    const helps = {}
    let success = true
    const doHelpMessage = (field, message) => {
      success = false
      helps[field] = message
    }

    console.log(direct, state.toInstagram)

    if (!state.messageContent) doHelpMessage('messageContent', 'Insira uma mensagem')

    if (!state.fromIsAnonymous && !state.fromName) doHelpMessage('fromName', 'Insira um nome')

    if (!state.toName) doHelpMessage('toName', 'Insira um nome')
    if (!state.toClassroom) doHelpMessage('toClassroom', 'Insira uma turma')

    if (direct && !state.toInstagram) doHelpMessage('toInstagram', 'Insira um usuário para receber a cartinha via direct')

    setHelpMessages({
      ...initialHelpMessages,
      ...helps
    })
    return success
  }

  const sendData = direct => async () => {
    if (!validate(direct)) return
    setLoading(direct ? 'direct' : 'feed')
    const data = {
      sender: state.fromIsAnonymous ?
        {
          anonymous: true
        } : {
          name: state.fromName,
          classroom: state.fromClassroom
        },
      recipient: {
        name: state.toName,
        classroom: state.toClassroom,
        instagram: state.toInstagram
      },
      deliveryMethod: direct ? 'direct' : 'feed',
      content: state.messageContent
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_PATH}/letters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
      setLoading('')
      if (response.status === 'waiting_for_approval') {
        setState(initialValues)
        onComplete()
      } else throw new Error('ue moises, seila qq deu')
    } catch (e) {
      openSimpleSnackBar('Um erro ocorreu, por favor tente novamente mais tarde.')
      setLoading('')
      console.error(e)
    }
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xl={12} xs={12}>
          <FormLabel component="legend">De</FormLabel>
        </Grid>
        <Grid item xs={12}>
          <Collapse in={!state.fromIsAnonymous}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TextField fullWidth
                           label="Nome"
                           variant="outlined"
                           value={state.fromName}
                           onChange={handleChange}
                           name="fromName"
                           helperText={helpMessages.fromName}
                           error={!!helpMessages.fromName}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <ClassroomSelector
                  label="Turma"
                  outsider
                  value={state.fromClassroom}
                  onChange={handleChange}
                  name="fromClassroom"
                  helperText={helpMessages.fromClassroom}
                  error={!!helpMessages.fromClassroom}
                />
              </Grid>
            </Grid>
          </Collapse>
        </Grid>

        <Grid item xl={12}>
          <FormControlLabel
            control={<Checkbox
              checked={state.fromIsAnonymous}
              name="fromIsAnonymous"
              onChange={handleCheckboxChange}
            />}
            label="Anônimo"/>
        </Grid>

        <Grid item xl={12} xs={12}>
          <FormLabel component="legend">Para</FormLabel>
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            label="Nome"
            variant="outlined"
            value={state.toName}
            onChange={handleChange}
            helperText={helpMessages.toName}
            error={!!helpMessages.toName}
            name="toName"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ClassroomSelector
            label="Turma"
            value={state.toClassroom}
            onChange={handleChange}
            helperText={helpMessages.toClassroom}
            error={!!helpMessages.toClassroom}
            name="toClassroom"
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <InstagramField
            inputProps={{
              label: 'Instagram (opcional)',
              maxwidth: 'true',
              variant: "outlined",
              helperText: helpMessages.toInstagram,
              error: !!helpMessages.toInstagram
            }}
            onSelect={data => setState(p => ({
              ...p,
              toInstagram: data ? data.username : null
            }))}
            name="toInstagram"
          />
        </Grid>

        <Grid item xl={12} xs={12}>
          <FormLabel component="legend">Mensagem</FormLabel>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <TextField
            label="Mensagem"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={state.messageContent}
            onChange={handleChange}
            helperText={helpMessages.messageContent}
            error={!!helpMessages.messageContent}
            name="messageContent"
          />
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <Button
            fullWidth
            disableElevation
            size="large"
            variant="outlined"
            color="secondary"
            onClick={sendData(true)}
            disabled={loading}
          >
            {loading === 'direct' ? <CircularProgress color="inherit" size={20}/> : 'Enviar via direct'}
          </Button>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Button
            fullWidth
            disableElevation
            size="large"
            variant="contained"
            color="primary"
            onClick={sendData(false)}
            disabled={loading}
          >
            {loading === 'feed' ? <CircularProgress color="inherit" size={25}/> : 'Enviar para o feed'}
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}
