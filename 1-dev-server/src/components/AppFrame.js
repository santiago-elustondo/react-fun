import React from 'react'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import { Button, Drawer, AppBar, Toolbar, Typography, Divider, IconButton } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'

import { thinker } from 'thinker-sdk.singleton'

const drawerWidth = 240

const styles = theme => ({
  root: {
    display: 'flex',
  },
  grow: {
    flexGrow: 1,
  },
  logo: {
    '&:hover': {
      color: theme.palette.secondary.dark,
      cursor: 'pointer'
    }
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: -5,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  drawerTitle: {
    paddingLeft: 10,
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
})

export const AppFrame = withRouter(withStyles(styles)(
  class extends React.PureComponent {

    state = {
      open: false,
    }
    
    render() {
      const { classes, history, children } = this.props
      const { open } = this.state
      
      return (
        <>
          <AppBar position="static" color="white" style={open ? { 
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth
          } : {}}>
            <Toolbar>
              {
                !open ? (
                  <IconButton 
                    className={classes.menuButton} 
                    color="inherit" 
                    aria-label="Menu" 
                    onClick={() => this.setState({ open: true })}
                  >
                    <MenuIcon/>
                  </IconButton>
                ) : null
              }
              <Typography variant="h6" color="inherit" className={classes.grow} onClick={() => history.push('/')}>
                <span className={classes.logo}>Thinker App</span>
              </Typography>
              <Button color="inherit" onClick={() => thinker.logout()}>Logout</Button>
              <IconButton
                aria-owns={open ? 'menu-appbar' : undefined}
                aria-haspopup="true"
                onClick={() => history.push(`/user/${thinker.user()._id}`)}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              <Typography variant="h6" className={classes.drawerTitle}>
                Following
              </Typography>
              <IconButton onClick={() => this.setState({ open: false })}>
                <ChevronLeftIcon/>
              </IconButton>
            </div>
            <Divider />
            <Typography variant='body1' style={{padding:16, color: 'gray'}}>
              (no followings)
            </Typography>
          </Drawer> 
          <div style={open ? { 
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth
          } : {}}>
            {children}
          </div>
        </>
      )
    }
  }
))