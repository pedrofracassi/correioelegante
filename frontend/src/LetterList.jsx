import React, { useEffect, useState } from 'react'

import {
  LinearProgress, Typography
} from "@material-ui/core"

import Letter from "./Letter.jsx"

const pageNames = {
  'waiting_for_approval': 'Entrada',
  'approved': 'Aguardando envio',
  'denied': 'Reprovadas',
  'delivered': 'Entregues',
  'errored': 'Falha no envio'
}

export default function LetterList ({ status }) {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getLetters() {
      fetch(`${process.env.REACT_APP_API_PATH}/letters${status ? `?status=${status}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
        }
      }).then(res => res.json()).then(json => {
        setLetters(json.sort((a, b) => b.timestamp - a.timestamp))
        setLoading(false)
      })
    }

    getLetters()
  }, [status])

  return (
    <div>
      <Typography variant="h2">{pageNames[status]}</Typography>
      <LinearProgress hidden={!loading}/>
      {
        letters.length > 0 ? letters.map(letter => {
          return <Letter letter={letter} key={letter._id} />
        }) : <Typography variant="h5" hidden={loading}>Nenhuma cartinha aqui :(</Typography>
      }
    </div>
  )
}
