import React, { useState, useEffect } from 'react';

import LetterList from "./LetterList.jsx"

import {
  Container
} from "@material-ui/core"

export default function Admin () {
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    async function getLetters() {
      fetch(`${process.env.REACT_APP_API_PATH}/letters`)
      .then(res => res.json())
      .then(json => setLetters(json.sort((a, b) => b.timestamp - a.timestamp)))
    }

    getLetters()
  }, [])

  return (
    <Container>
      <LetterList letters={letters} />
    </Container>
  )
}
