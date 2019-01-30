import React from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';

import { UserListItem } from './UserListItem'

const MOCK_DATA = [
  {
    username: 'johnny',
    created: '2019-01-31',
    _id: 1
  },
  {
    username: 'sarah',
    created: '2019-01-31',
    _id: 2
  }
]

export class UserList extends React.PureComponent {

  state = { currentlyHovering: null }

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
    const { currentlyHovering } = this.state
    return (
      <List style={{ width: 200, marginLeft: 'auto', marginRight: 'auto' }}>
        {
          MOCK_DATA.map(user => {

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
}