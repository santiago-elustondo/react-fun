import React from 'react'
import { LinearProgress } from '@material-ui/core'

import { thinker } from 'thinker-sdk.singleton'
import { AuthPage } from './AuthPage'
import { FeedPage } from './FeedPage'

export class App extends React.PureComponent {

  state = {
    authState: 'LOADING',
    open: false,
  }

  componentDidMount() {
    thinker.subscribeToAuthState(state => this.setState({ authState: state }))
  }

  render() {
    const { authState } = this.state

    return authState === 'LOADING' ? (
      <LinearProgress />
    ) : authState === 'LOGGED-OUT' ? (
      <AuthPage/>
    ) : (
      <FeedPage/>
    )
  }
}