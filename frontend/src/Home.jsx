import React from 'react'
import {
  Box,
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginRight: theme.spacing(2)
  },
}));

function Home() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div>
      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel id="demo-simple-select-filled-label">Age</InputLabel>
        <Select
          variant="outlined"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
      </div>
    </div>
  )
}

export default Home