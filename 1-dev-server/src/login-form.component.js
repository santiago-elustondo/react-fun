import React, { Component } from 'react'
import { Grid, TextField, Paper, Typography, Tabs, Tab, Button, LinearProgress, CircularProgress} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import { apiService } from 'api/service.singleton'
import { UserCard } from './user-card.pure'

const LOGO_URL = 'https://dumielauxepices.net/sites/default/files/half-life-clipart-lamp-630918-4022206.png'

const styles = theme => ({ })

export const LoginForm = withStyles(styles)(
  class extends Component {

    state = { 
      waiting: false,
      errorMsg: false,
      username: '',
      password: '',
    }

    async tryLogin() {
      const { username, password } = this.state
      const { onLoggedIn } = this.props

      this.setState({ waiting: true })
      const { success } = await apiService.login({ username, password })
      this.setState({ waiting: false })
      if (success) { 
        this.setState({ errorMsg: false })
      } else {
        this.setState({ errorMsg: 'login failed, check your credentials' })
      }
    }

    render() {
      const { username, password, waiting, errorMsg } = this.state
      const { fieldWidth } = this.props
      
      return (
        <Grid 
          container 
          direction="column" 
          spacing={0} 
          justify="space-around"
          alignItems="center"
        >
          <TextField
            label="Username"
            style={{ width: fieldWidth }}
            margin="normal"
            disabled={waiting}
            value={username}
            onChange={e => this.setState({ username: e.target.value })}
          />
          <TextField
            label="Password"
            style={{ width: fieldWidth }}
            type="password"
            margin="normal"
            disabled={waiting}
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
          />
          {
            errorMsg ? (
              <Typography component='p' style={{color: 'red'}}>
                {errorMsg}
              </Typography>
            ) : null
          }
          <Button 
            color="primary" 
            style={{ marginTop: 13 }}
            onClick={() => this.tryLogin()}
            disabled={waiting}
          >
            Submit
          </Button>
          {
            waiting ? (
              <CircularProgress /> 
            ) : null
          }
        </Grid>
      )
    }
  }
)