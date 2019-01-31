import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'

export const UserListItem = ({ user, color, onMouseEnter, onMouseLeave }) =>
  <ListItem
    style={{ backgroundColor: color || 'inherit' }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  > 
    <Avatar> <AccountCircleIcon /> </Avatar>
    <ListItemText primary={user.username} secondary={user.created.substring(0, 10)}/>
  </ListItem>
