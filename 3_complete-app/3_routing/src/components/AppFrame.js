import React from 'react'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import { Button, Drawer, AppBar, Toolbar, Typography, Divider, IconButton } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'

import { thinker } from 'thinker-sdk.singleton'

import './AppFrame.css'

export const AppFrame = withRouter(class extends React.PureComponent {
    
    render() {
      const { history, children } = this.props
      
      return (
          <div>
          <AppBar position="static" color="inherit" className='navbar'>
            <Toolbar>
              <Typography 
                variant="h6" color="inherit" 
                style={{ flexGrow: 1 }} 
              >
                <span 
                  className='home-button' 
                  onClick={() => history.push('/')}
                >
                  Thinker App
                </span>
              </Typography>
              <Button color="inherit" onClick={() => thinker.logout()}>
                Logout
              </Button>
              <IconButton
                aria-haspopup="true"
                onClick={() => history.push(`/user/${thinker.user()._id}`)}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Toolbar>
          </AppBar>
          {children}
        </div>
      )
    }
  }
)