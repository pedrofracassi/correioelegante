import React from 'react'

import Letter from "./Letter.jsx"


export default function LetterList ({ letters }) {
  return letters ? letters.map(letter => {
    return <Letter letter={letter} key={letter._id} />
  }) : <></>
}
