import React from 'react'

import {
    TextField,
    Avatar,
    Grid,
    Typography
} from '@material-ui/core'

import AutoComplete from '@material-ui/lab/Autocomplete'

const searchResults = [
  {
    user: {
      username: "pedro.fracassi",
      full_name: "Pedro Fracassi",
      profile_pic_url: "https://z-p42-instagram.fssa3-1.fna.fbcdn.net/v/t51.2885-19/s150x150/57429767_314250555920683_4901978189334577152_n.jpg?_nc_ad=z-m&_nc_ht=z-p42-instagram.fssa3-1.fna.fbcdn.net&_nc_ohc=UMZGAsM4HdcAX9XDWSt&oh=b2a095e7c7a65e3816580794a355f4fe&oe=5EFD5C30"
    }
  }
]

export default function InstagramField ({ ...props }) {
  return (
    <AutoComplete
      freeSolo
      value={props.value}
      onChange={props.onChange}
      name={props.name}
      includeInputInList
      options={searchResults.map(r => r.user)}
      getOptionLabel={option => option.username}
      renderInput={(params) => 
        <TextField {...params} { ...props } />    
      }
      renderOption={option => {
        return (
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <Avatar src={option.profile_pic_url} alt={option.full_name}></Avatar>
            </Grid>
            <Grid item xs>
              {option.full_name}
              <Typography variant="body2" color="textSecondary">
                @{option.username}
              </Typography>
            </Grid>
          </Grid>
        )
      }}
    />
  )
}