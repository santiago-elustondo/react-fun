import React, { Component } from 'react'
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import { Grid, TextField,  Paper, Typography, Tabs, Tab } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import { apiService } from 'api/service.singleton'

import { SignupForm } from './signup-form.component'

const LOGO_URL = 'https://dumielauxepices.net/sites/default/files/half-life-clipart-lamp-630918-4022206.png'

const styles = theme => ({
  root: {
    flexGrow: 1,
    paddingTop: 20,
  },
  island: {
    maxWidth: 540
  }
})

export const LoginPage = withRouter(withStyles(styles)(
  class extends Component {

    state = { 
      tab: 0 
    }

    render() {
      const { tab } = this.state
      const { classes, history } = this.props
      
      return (
        <Grid container className={classes.root} spacing={16} justify="space-around" alignItems="center">
          <Grid item xs={10} sm={6} className={classes.island} style={{ textAlign: 'center' }}>
            <Paper style={{ padding: 25}}>
              <Grid container direction="column" className={classes.root} spacing={16} justify="space-around" alignItems="center">
                <Grid item>
                  <img 
                    style={{ height: '150px' }}
                    src={LOGO_URL} 
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h4">
                    Welcome to <b>Thinker</b>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography component="p">
                    Log in to start sharing your thoughts!
                  </Typography>
                </Grid>
                <Grid item style={{ marginTop: '30px' }}>
                  <Tabs
                    value={tab}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={(e, tab) => this.setState({ tab })}
                  >
                    <Tab label="Login" />
                    <Tab label="Signup" />
                  </Tabs>
                </Grid>
                <Grid item>
                  <SignupForm 
                    fieldWidth='250px'
                    mode={tab === 0 ? 'login' : 'signup'}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )
    }
  }
))