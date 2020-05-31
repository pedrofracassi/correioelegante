import React from 'react'

import {
    TextField
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

export default function InstagramField ({ label }) {
  return (
    <AutoComplete
      freeSolo
      options={searchResults.map(r => r.user.username)}
      renderInput={(params) => 
        <TextField {...params} fullWidth label="Instagram (opcional)" variant="outlined" />    
      }
    />
  )
}