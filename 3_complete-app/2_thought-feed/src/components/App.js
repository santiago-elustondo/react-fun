import React from 'react'
import { LinearProgress } from '@material-ui/core'

import { AuthPage } from './AuthPage'
import { thinker } from 'thinker-sdk.singleton'

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
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <h4> logged in as {thinker.user().username} </h4>
        <button onClick={() => thinker.logout()}> logout </button>
      </div>
    )
  }
}