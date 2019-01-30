import React from 'react'
import List from '@material-ui/core/List'
import CircularProgress from '@material-ui/core/CircularProgress';

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
    users: null
  }

  async fetchUsers() {
    const response = await fetch('http://node200.eastus.cloudapp.azure.com:5008/users')
    const users = await response.json()

    this.setState({ loading: false, users })
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
    const { currentlyHovering, loading, users } = this.state
    return (
      <div style={{ width: 200, marginTop: 20, marginLeft: 'auto', marginRight: 'auto' }}>
        {
          loading? (
            <CircularProgress style={{ margin: 80 }}/>
          ) : (
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
          )
        }
      </div>
    )
  }
}