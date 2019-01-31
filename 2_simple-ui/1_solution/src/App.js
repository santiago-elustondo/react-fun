import React from 'react'

import { UserList } from './UserList'

export class App extends React.PureComponent {
  render() {
    return (
      <div style={{ 
        width: 200, 
        marginTop: 20, 
        marginLeft: 'auto', 
        marginRight: 'auto' 
      }}>
        <UserList/>
      </div>
    )
  }
}