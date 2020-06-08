import React, { useState } from "react"

import {
  makeStyles
} from "@material-ui/core/styles"

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Collapse,
  LinearProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@material-ui/core"

const useStyles = makeStyles({
  card: {
    marginBottom: 10,
  },
  chip: {
    marginLeft: 5
  },
  right: {
    marginLeft: 'auto'
  }
})

function getClassroomDisplayName(classroom) {
  switch(classroom) {
    case 'EX':
      return 'Ex-aluno'
    case 'VS':
      return 'Visitante'
    default:
      return `${classroom[0]}º${classroom[1]}`
  }
}

export default function Letter ({ letter }) {
  const [collapseIn, setCollapseIn] = useState(true)
  const [loading, setLoading] = useState(false)
  const [confirmationDialog, setConfirmationDialog] = useState(false)
  const classes = useStyles()

  function updateStatus(status, force) {
    if (['approved', 'denied'].includes(letter.status) && !force) {
      setConfirmationDialog(true)
    } else {
      setConfirmationDialog(false)
      setLoading(true)                                              // O ?firstTime=true garante que duas pessoas não vão aprovar a mesma carta duas vezes
      fetch(`${process.env.REACT_APP_API_PATH}/letters/${letter._id}${letter.status === 'waiting_for_approval' ? '?firstTime=true' : ''}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
        },
        body: JSON.stringify({ status })
      }).then(res => {
        if (res.status === 200) {
          setCollapseIn(false)
        } else {
          setLoading(false)
        }
      })
    }
  }

  return (
    <Collapse in={collapseIn}>
      <Card className={classes.card} variant="outlined">
        <CardContent>
          <Typography variant="h5">
            {letter.recipient.name}
            <Chip size="small" label={getClassroomDisplayName(letter.recipient.classroom)} className={classes.chip} variant="outlined"/>
            {
              letter.recipient.instagram ? <Chip
                size="small"
                label={`@${letter.recipient.instagram}`}
                className={classes.chip}
                variant="outlined"
                clickable
                component="a"
                href={`https://instagram.com/${letter.recipient.instagram}`}
                /> : <></>
            }
          </Typography>
          <Typography gutterBottom>
            {letter.content}
          </Typography>
          <Typography variant="button">
            { letter.sender.anonymous ? 'Anônimo' : `${letter.sender.name}${letter.sender.classroom ? `, ${getClassroomDisplayName(letter.sender.classroom)}` : ''}` }
          </Typography>
          <Typography gutterBottom variant="body2">
            {new Date(letter.timestamp).toLocaleString()}
          </Typography>
          {
            letter.lastUpdate ? (
              <Typography variant="body2" gutterBottom>
                Filtrada por <strong>{letter.lastUpdate.user.name}</strong>
              </Typography>
            ) : (
              <></>
            )
          }
          {
            letter.error ? (
              <Typography variant="body2" gutterBottom>
                <strong>Erro:</strong> {letter.error}
              </Typography>
            ) : (
              <></>
            )
          }
          <Chip size="small" color={letter.deliveryMethod === 'feed' ? 'primary' : 'secondary'} label={letter.deliveryMethod === 'feed' ? 'Feed' : 'Direct'} />
        </CardContent>
        <CardActions>
          { ['waiting_for_approval', 'denied'].includes(letter.status) ? <Button disabled={loading} size="small" disableElevation color="primary" onClick={() => updateStatus('approved')}>Aprovar</Button> : <></> }
          { ['waiting_for_approval', 'approved'].includes(letter.status) ? <Button disabled={loading} size="small" disableElevation color="secondary" onClick={() => updateStatus('denied')}>Reprovar</Button> : <></> }
          { letter.instagramPostCode ? <Button disabled={loading} size="small" disableElevation component="a" href={`https://instagram.com/p/${letter.instagramPostCode}/`}>Ver no Instagram</Button> : <></> }
          <Button size="small" disabled={loading} component="a" href={`${process.env.REACT_APP_API_PATH}/jpeg/${letter._id}`}>Preview</Button>
        </CardActions>
        <LinearProgress hidden={!loading}/>
      </Card>
      <Dialog open={confirmationDialog} >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {
              letter.status === 'approved' ? 
                `Essa cartinha foi aprovada por ${letter.lastUpdate.user.name}. Deseja mesmo reprová-la?` :
              letter.status === 'denied' ?
                `Essa cartinha foi reprovada por ${letter.lastUpdate.user.name}. Deseja mesmo aprová-la?` :
              ''
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationDialog(false)} >
            Cancelar
          </Button>
          {
            letter.status === 'denied' ?
              <Button onClick={() => updateStatus('approved', true)} color="primary" autoFocus>
                Aprovar
              </Button> :
              <Button onClick={() => updateStatus('denied', true)} color="secondary" autoFocus>
                Reprovar
              </Button>
          }
        </DialogActions>
      </Dialog>
    </Collapse>
  )
}
