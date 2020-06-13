import React from 'react'

import {
  Container,
  Typography
} from "@material-ui/core"

export default function ThankYou () {
  return (
    <Container maxWidth="xs" height="100%">
      <Typography><strong>O envio de cartinhas foi encerrado. Obrigado pela participação!</strong></Typography>
      <br/>
      <Typography>Continuaremos entregando as cartinhas já enviadas até que todas tenham sido recebidas.</Typography>
    </Container>
  )
}
