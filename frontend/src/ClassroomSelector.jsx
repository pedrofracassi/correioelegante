import React from 'react'

import {
    MenuItem,
    ListSubheader,
    Select,
    FormControl,
    InputLabel
} from '@material-ui/core'

export default function ClassroomSelector ({ ...props }) {
  return (
    <FormControl variant="outlined" disabled={props.disabled} fullWidth>
      <InputLabel id="label">{props.label}</InputLabel>
      <Select labelId="label" id="grouped-select" {...props}>
        <MenuItem value="EX">Ex-aluno(a)</MenuItem>
        <ListSubheader>Fundamental</ListSubheader>
        <MenuItem value="6A">6º ano A</MenuItem>
        <MenuItem value="6B">6º ano B</MenuItem>
        <MenuItem value="6C">6º ano C</MenuItem>
        <MenuItem value="6D">6º ano D</MenuItem>
        <MenuItem value="7A">7º ano A</MenuItem>
        <MenuItem value="7B">7º ano B</MenuItem>
        <MenuItem value="7C">7º ano C</MenuItem>
        <MenuItem value="8A">8º ano A</MenuItem>
        <MenuItem value="8B">8º ano B</MenuItem>
        <MenuItem value="8C">8º ano C</MenuItem>
        <MenuItem value="9A">9º ano A</MenuItem>
        <MenuItem value="9B">9º ano B</MenuItem>
        <MenuItem value="9C">9º ano C</MenuItem>
        <ListSubheader>Médio</ListSubheader>
        <MenuItem value="1A">1º ano A</MenuItem>
        <MenuItem value="1B">1º ano B</MenuItem>
        <MenuItem value="2A">2º ano A</MenuItem>
        <MenuItem value="2B">2º ano B</MenuItem>
        <MenuItem value="2C">2º ano C</MenuItem>
        <MenuItem value="1A">3º ano A</MenuItem>
        <MenuItem value="1B">3º ano B</MenuItem>
      </Select>
    </FormControl>
  )
}