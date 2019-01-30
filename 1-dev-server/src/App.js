import React, { Component } from 'react'
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import { Grid, TextField, Paper, Button, IconButton, Typography, AppBar, Toolbar,  MenuItem, Menu, LinearProgress } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import { thinker } from 'thinker-sdk.singleton'
import { FeedPage, ThoughtPage } from './components'

import { LoginPage } from './login-page.connected'
import { AppFrame } from './app-frame'
import { UserDetails } from './user-page'

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
}

class App extends Component {

  state = {
    authState: 'LOADING',
    open: false,
  }

  componentDidMount() {
    thinker.subscribeToAuthState(state => this.setState({ authState: state }))
  }
  
  render() {
    const { classes, history } = this.props
    const { authState, isUserMenuOpen } = this.state

    const currentPath = history.location.pathname
    
    return (
      <>
        {
          authState === 'LOADING' ? (
            <LinearProgress />
          ) : authState === 'LOGGED-OUT' && currentPath !== '/login' ? (
            <Redirect to='/login'/>
          ) : authState === 'LOGGED-IN' && currentPath === '/login' ? (
            <Redirect to='/'/>
          ) : authState === 'LOGGED-IN' && currentPath === '/' ? (
            <Redirect to='/feed'/>
          ) : (
            <Switch>
              <Route path='/login' component={LoginPage}/>
              <AppFrame>
                <Switch>
                  <Route path='/feed' component={FeedPage}/>
                  <Route path='/user/:userId/thought/:thoughtId' render={
                    ({ match }) => <ThoughtPage {...match.params} />
                  }/>
                  <Route path='/user/:userId' render={
                    ({ match }) => <UserDetails {...match.params} />
                  }/>
                  <Route path='/' render={() => <h1>404</h1>}/>
                </Switch>
              </AppFrame>
            </Switch>
          )
        }
      </>
    )
  }
}

export default withRouter(withStyles(styles)(App))