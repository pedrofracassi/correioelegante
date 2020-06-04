import React, {useState} from 'react'
import SubmissionForm from './SubmissionForm.jsx'
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import CheckIcon from '@material-ui/icons/Check';
import {makeStyles} from '@material-ui/core/styles';
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Container } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  alert: {
    marginTop: 30,
    marginBottom: 30,
    paddingTop: 30,
    paddingBottom: 30,
  },
  sendAnother: {
    marginTop: 30
  },
  fullWidth: {
    width: '100%'
  }
}));

export default function Home({openSimpleSnackBar}) {
  const [complete, setComplete] = useState(false)

  const classes = useStyles()
  return (
    <div>
      <Container maxWidth="md">
        <Collapse in={complete}>
          <Alert
            icon={<CheckIcon fontSize="inherit"/>}
            severity="success"
            className={classes.alert}
            classes={{
              message: classes.fullWidth
            }}
          >
            <div className={classes.fullWidth}>
              <AlertTitle>Cartinha enviada com sucesso!</AlertTitle>
              Entregaremos ela assim que possível! 🙂
              <Grid container className={classes.sendAnother} justify="flex-end">
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    disableElevation
                    onClick={() => setComplete(false)}
                  >
                    Enviar outra
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Alert>
        </Collapse>
        <Collapse in={!complete}>
          <SubmissionForm onComplete={() => setComplete(true)} openSimpleSnackBar={openSimpleSnackBar}/>
        </Collapse>
      </Container>
    </div>
  )
}
