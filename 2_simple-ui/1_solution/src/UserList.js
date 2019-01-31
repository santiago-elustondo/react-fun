import React from 'react'
import List from '@material-ui/core/List'
import { Paper, Button, Typography, TextField, CircularProgress } from '@material-ui/core'

import { UserListItem } from './UserListItem'

// const MOCK_DATA = [
//   {
//     username: 'johnny',
//     created: '2019-01-31',
//     _id: 1
//   },
//   {
//     username: 'sarah',
//     created: '2019-01-29',
//     _id: 2
//   },
//   {
//     username: 'kelly',
//     created: '2019-01-10',
//     _id: 3
//   }
// ]

export class UserList extends React.PureComponent {

  state = { 
    loading: true,
    currentlyHovering: null,
    users: null,
    newUsername: ''
  }

  async fetchUsers() {
    const response = await fetch('http://node200.eastus.cloudapp.azure.com:5008/users')
    const users = await response.json()

    this.setState({ loading: false, users })
  }

  async submitNewUser() {
    const { newUsername, users } = this.state

    if (!newUsername) return

    // not actually querying
    const newUser = {
      username: newUsername,
      created: (new Date()).toString(),
      _id: Math.random().toString(36).substring(7)
    }

    this.setState(state => ({
      users: [newUser].concat(state.users),
      newUsername: ''
    }))
  }

  componentDidMount() {
    this.fetchUsers()
  }

  hoveringOver(user) {
    this.setState({ currentlyHovering: user })
  }

  noLongerHoveringOver(user) {
    this.setState(state => {
      if (state.currentlyHovering === user) 
        return { currentlyHovering: null }  
    })
  }

  render() {
    const { currentlyHovering, loading, users, newUsername } = this.state
    
    return loading? (
      <CircularProgress style={{ margin: 80 }}/>
    ) : (
      <>
        <Paper style={{ padding: 20 }}>
          <Typography>
            Add a new user
          </Typography>
          <TextField
            value={newUsername}
            onKeyDown={e => { if (e.key === 'Enter') this.submitNewUser() }}
            onChange={e => this.setState({ newUsername: e.target.value })}
          />
          <Button
            onClick={e => this.submitNewUser()}
          > 
            Submit
          </Button>
        </Paper>
        <List>
          {
            users.map(user => {

              const color = (
                currentlyHovering && 
                (currentlyHovering._id === user._id)
              ) ? 'lightgray' : undefined

              return (
                <UserListItem 
                  key={user._id} 
                  user={user} 
                  onMouseEnter={u => this.hoveringOver(user)}
                  onMouseLeave={u => this.noLongerHoveringOver(user)}
                  color={color}
                />
              )
              
            })
          }
        </List>
      </>
    )
  }
}