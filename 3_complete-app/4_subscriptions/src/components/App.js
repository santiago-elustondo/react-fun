import React from 'react'
import { withRouter, Switch, Route, Redirect } from 'react-router-dom'
import { LinearProgress } from '@material-ui/core'

import { thinker } from 'thinker-sdk.singleton'
import { AuthPage } from './AuthPage'
import { FeedPage } from './FeedPage'
import { ThoughtPage } from './ThoughtPage'
import { UserPage } from './UserPage'
import { AppFrame } from './AppFrame'

export const App = withRouter(class extends React.PureComponent {

  state = {
    authState: 'LOADING',
    open: false,
  }

  componentDidMount() {
    thinker.subscribeToAuthState(state => this.setState({ authState: state }))
  }

  render() {
    const { authState } = this.state
    const { history } = this.props

    const currentPath = history.location.pathname

    return authState === 'LOADING' ? (
      <LinearProgress />
    ) : authState === 'LOGGED-OUT' && currentPath !== '/login' ? (
      <Redirect to='/login'/>
    ) : authState === 'LOGGED-IN' && currentPath === '/login' ? (
      <Redirect to='/'/>
    ) : authState === 'LOGGED-IN' && currentPath === '/' ? (
      <Redirect to='/feed'/>
    ) : (
      <Switch>
        <Route path='/login' component={AuthPage}/>
        <AppFrame>
          <Switch>
            <Route path='/feed' component={FeedPage}/>
            <Route path='/user/:userId/thought/:thoughtId' render={
              ({ match }) => <ThoughtPage {...match.params} />
            }/>
            <Route path='/user/:userId' render={
              ({ match }) => <UserPage {...match.params} />
            }/>
            <Route path='/' render={() => <h1>404</h1>}/>
          </Switch>
        </AppFrame>
      </Switch>
    )
  }
})