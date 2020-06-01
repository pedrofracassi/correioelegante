import React, {useState} from 'react'

import {
    TextField,
    Avatar,
    Grid,
    Typography
} from '@material-ui/core'

import AutoComplete from '@material-ui/lab/Autocomplete'
import CircularProgress from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";

const searchResults = [
  {
    user: {
      username: "pedro.fracassi",
      full_name: "Pedro Fracassi",
      profile_pic_url: "https://z-p42-instagram.fssa3-1.fna.fbcdn.net/v/t51.2885-19/s150x150/57429767_314250555920683_4901978189334577152_n.jpg?_nc_ad=z-m&_nc_ht=z-p42-instagram.fssa3-1.fna.fbcdn.net&_nc_ohc=UMZGAsM4HdcAX9XDWSt&oh=b2a095e7c7a65e3816580794a355f4fe&oe=5EFD5C30"
    }
  }
]

export default function InstagramField ({ onSelect, inputProps }) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearchChange = async value => {
    setLoading(true)
    const res = await fetch(`https://z-p3.www.instagram.com/web/search/topsearch/?query=${value}`).then(r => r.json())
    setLoading(false)
    setResults(res.users.map(u => u.user))
  }

  return (
    <AutoComplete
      loading={loading}
      options={results}
      filterSelectedOptions
      getOptionSelected={(option, value) => option.username === value.username}
      getOptionLabel={option => option.username}
      renderInput={(params) =>
        <TextField {...params} {...inputProps}
                   InputProps={{
                     ...params.InputProps,
                     endAdornment: (
                       <>
                         {loading ? <CircularProgress color="inherit" size={20} /> : null}
                         {params.InputProps.endAdornment}
                       </>
                     ),
                     startAdornment: <InputAdornment position="start">@</InputAdornment>
                   }}
        />
      }
      onInputChange={(event, newValue) => handleSearchChange(newValue)}
      onChange={(event, value) => onSelect(value)}
      renderOption={option => {
        return (
          <Grid container key={option.pk} alignItems="center" spacing={1}>
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
