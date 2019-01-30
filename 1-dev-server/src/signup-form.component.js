import React, { Component } from 'react'
import { Grid, TextField, Paper, Typography, Tabs, Tab, Button, LinearProgress, CircularProgress} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import { apiService } from 'api/service.singleton'

const LOGO_URL = 'https://dumielauxepices.net/sites/default/files/half-life-clipart-lamp-630918-4022206.png'

const styles = theme => ({ })

export const SignupForm = withStyles(styles)(
  class extends Component {

    state = { 
      waiting: false,
      formIsValid: false,
      serverError: false,
      username: '',
      password: '',
      passwordRepeat: '',
      prevProps: {},
    }

    async tryLogin() {
      const { username, password } = this.state

      this.setState({ waiting: true })
      const { success } = await apiService.login({ username, password })
      this.setState({ waiting: false })
      if (success) { 
        this.setState({ serverError: false })
      } else {
        this.setState({ serverError: 'login failed, check your credentials' })
      }
    }

    async trySignup() {
      const { username, password } = this.state

      this.setState({ waiting: true })
      
      const { success } = await apiService.signup({ username, password })

      this.setState({ waiting: false })
      if (success) { 
        this.setState({ serverError: false })
      } else {
        this.setState({ serverError: 'signup failed. maybe name is taken?' })
      }
    }

    shouldAllowSubmit() {
      const { username, password, passwordRepeat, waiting } = this.state

      const allInputsAreGiven = this.isSignupMode()
        ? ( username && password && passwordRepeat ) 
        : ( username && password )

      const passwordsMatch = password === passwordRepeat

      return !waiting && 
        allInputsAreGiven && 
        (!this.isSignupMode() || passwordsMatch)
    }

    isSignupMode() {
      const { mode } = this.props
      return mode === 'signup'
    }

    submit() {
      if (!this.shouldAllowSubmit()) return
      if (this.isSignupMode()) this.trySignup()
      else this.tryLogin()
    }

    submitOnEnter(key) {
      if (key === 'Enter') this.submit()
    }

    static getDerivedStateFromProps(props, state) {
      const { prevProps: { mode: prevMode }, serverError } = state
      const { mode } = props

      return {
        serverError: (mode === prevMode) ? serverError : '',
        prevProps: { mode }
      }
    }

    render() {
      const { username, password, passwordRepeat, waiting, serverError } = this.state
      const { fieldWidth } = this.props

      const signupMode = this.isSignupMode()
      const passwordsMatch = password === passwordRepeat

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
            onKeyDown={e => this.submitOnEnter(e.key)}
            onChange={e => this.setState({ username: e.target.value })}
          />
          <TextField
            label="Password"
            style={{ width: fieldWidth }}
            type="password"
            margin="normal"
            disabled={waiting}
            value={password}
            onKeyDown={e => this.submitOnEnter(e.key)}
            onChange={e => this.setState({ password: e.target.value })}
          />
          {
            signupMode ? (
              <TextField
                label="Repeat Password"
                style={{ width: fieldWidth }}
                type="password"
                margin="normal"
                disabled={waiting}
                value={passwordRepeat}
                onKeyDown={e => this.submitOnEnter(e.key)}
                onChange={e => this.setState({ passwordRepeat: e.target.value })}
              />
            ) : null
          }
          <Typography component='p' style={{color: 'red' }}>
            {
              serverError 
              || (signupMode && passwordRepeat && !passwordsMatch) && 'passwords don\'t match'
            }
          </Typography>
          {
            waiting ? (
              <CircularProgress 
                style={{ marginTop: 13 }}
              /> 
            ) : (
              <Button 
                color="primary" 
                style={{ marginTop: 13 }}
                onClick={() => this.submit()}
                disabled={!this.shouldAllowSubmit()}
              >
                Submit
              </Button>
            )
          }
        </Grid>
      )
    }
  }
)