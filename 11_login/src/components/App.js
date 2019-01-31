import React from 'react'

import { AuthForm } from './AuthForm'

export class App extends React.PureComponent {
  render() {
    return (
      <div style={{ 
        width: 200, 
        marginTop: 20, 
        marginLeft: 'auto', 
        marginRight: 'auto' 
      }}>
        <AuthForm/>
      </div>
    )
  }
}