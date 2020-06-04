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
  CardHeader,
  Collapse
} from "@material-ui/core"

const useStyles = makeStyles({
  card: {
    marginBottom: 10,
  },
  chip: {
    marginLeft: 5
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
  const [letterCollapse, setLetterCollapse] = useState(false)
  const classes = useStyles()

  return (
    <Collapse in="false">
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
          <Chip size="small" color={letter.deliveryMethod === 'feed' ? 'primary' : 'secondary'} label={letter.deliveryMethod === 'feed' ? 'Feed' : 'Direct'} />
        </CardContent>
      </Card>
    </Collapse>
  )
}

/*
<div>
      {letter._id}
      <br/>
      <b>De:</b> {letter.sender.name} {letter.sender.classroom}
      <br/>
  <b>Para:</b> {letter.recipient.name} {letter.recipient.classroom} (@{letter.recipient.instagram})
      <br/>
      <b>Entrega:</b> {letter.deliveryMethod}
      <br/>
      <b>Horário:</b> {new Date(letter.timestamp).toLocaleString()}
      <br/>
      <b>Mensagem:</b> {letter.content}
      <br/>
      <a href={`${process.env.REACT_APP_API_PATH}/jpeg/${letter._id}`}>Preview</a>
      <hr/>
    </div>
*/