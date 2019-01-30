import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import { Grid, TextField, LinearProgress, Typography, Paper, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import Badge from '@material-ui/core/Badge'
import MessageIcon from '@material-ui/icons/Message';
import CheckIcon from '@material-ui/icons/Check'

import { apiService } from 'api/service.singleton'

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 10
  },
  textField: {
    width: 200,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
  thoughtCard: {
    '&:hover': {
      cursor: 'pointer',
      background: 'rgb(230, 230, 230)'
    }
  },
  commentBadge: {
    top: '30%',
    border: `2px solid ${theme.palette.grey[800]}`,
    backgroundColor: 'white',
    color: theme.palette.grey[800]
  },
  commentIcon: {
    color: theme.palette.grey[800]
  }
})

export const UserDetails = withRouter(withStyles(styles)(
  class extends Component {

    state = {
      loading: true,
      submitting: false,
      user: null,
      commentTxt: ''
    }

    async fetchData() {
      const { userId } = this.props

      const user = await apiService.getUserComplete({ userId })
      const myFollowings = await apiService.getFollowings({ userId: apiService.authUser()._id })

      this.setState({ 
        loading: false, 
        user,
        myFollowings
      })
    }

    componentDidMount() {
      this.fetchData()  
    }

    async follow() {
      const { user } = this.state
      await apiService.follow({ userId: user._id })
    }

    async unfollow() {
      const { user } = this.state
      await apiService.unfollow({ userId: user._id })
    }
    
    render() {
      const { loading, user, myFollowings } = this.state
      const { classes, history } = this.props
    
      return loading ? (
        <LinearProgress /> 
      ) : (
        <Grid container direction="column" spacing={16} alignItems={'center'}>
          <Grid item xs={10} sm={8} md={6} lg={5} style={{ width: '100%', marginTop: '30px'}}>
            <Grid container justify="space-between">
              <Grid item xs={6}>
                <Typography 
                  variant='h5' 
                  className={classes.username} 
                  onClick={() => history.push(`/user/${user._id}`)}
                >
                  {user.username} 
                  {/* {
                    user._id !== apiService.authUser()._id ? (
                      !myFollowings.includes(user._id) ? (
                        <Button 
                          color='primary'
                          onClick={() => this.follow()}
                        > Follow </Button>
                      ) : (
                        <Button 
                          onClick={() => this.unfollow()}
                          style={{ color: 'green' }}
                        > 
                          FOLLOWING <CheckIcon style={{ marginBottom: '3' }}/>
                        </Button>
                      )
                    ) : null
                  } */}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant='body1' align="right" style={{ display: 'flex', flexDirection: 'column' }}>
                  <b>{user.followers.length} followers</b>  joined on {user.created.substring(0, 10)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {
            user.thoughts.length ? (
              user.thoughts.map(thought => (
                <Grid item xs={10} sm={8} md={6} lg={5} style={{ width: '100%' }}>
                  <Paper 
                    style={{padding:'10px'}} 
                    className={classes.thoughtCard} 
                    onClick={() => history.push(`/user/${user._id}/thought/${thought._id}`)}
                  >
                    <Grid container>
                      <Grid container justify="space-between">
                        <Grid item xs={9}>
                          <Typography variant='body'>
                            {thought.content}
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography variant='body' align="right">
                            {thought.created.substring(0, 10)}
                          </Typography>
                          <div style={{ textAlign: 'right', paddingRight: 10, paddingTop: 10 }}>
                            {
                              thought.comments.length ? (
                                <Badge style={{ marginLeft: 0}} badgeContent={thought.comments.length} color="primary" classes={{ badge: classes.commentBadge }}>
                                  <MessageIcon className={classes.commentIcon}/>
                                </Badge>
                              ) : null
                            }
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" style={{color: 'gray', paddingTop: 30}}>
                (no thoughts)  
              </Typography>
            )
          }
        </Grid>
      )
    }
  }
))