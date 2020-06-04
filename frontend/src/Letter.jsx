import React from "react"

export default function Letter ({ letter }) {
  return (
    <div>
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
  )
}
