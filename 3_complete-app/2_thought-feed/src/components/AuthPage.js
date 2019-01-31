import React from 'react'
import { Grid, Paper, Typography, Tabs, Tab } from '@material-ui/core'

import { AuthForm } from './AuthForm'

import lightbulbPNG from '../assets/lightbulb.png'

export class AuthPage extends React.PureComponent {

  state = { tab: 0 }

  render() {
    const { tab } = this.state
    
    return (
      <Grid container 
        style={{ flexGrow: 1, paddingTop: 20 }} 
        spacing={16} justify="space-around" 
        alignItems="center"
      >
        <Grid item 
          xs={10} sm={6} 
          style={{ textAlign: 'center', maxWidth: 540 }}
        >
          <Paper style={{ padding: 25}}>
            <Grid container 
              direction="column" 
              style={{ flexGrow: 1, paddingTop: 20 }} 
              spacing={16} justify="space-around" 
              alignItems="center"
            >
              <Grid item>
                <img 
                  style={{ height: '150px' }}
                  alt='lightbulb'
                  src={lightbulbPNG} 
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
                <AuthForm 
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