import React from 'react'
import { withRouter } from 'react-router-dom'
import { Grid, LinearProgress, Typography, withStyles } from '@material-ui/core'

import { thinker } from 'thinker-sdk.singleton'
import { ThoughtPaper } from './ThoughtPaper'

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
  }
})

export const UserPage = withRouter(withStyles(styles)(
  class extends React.PureComponent {

    state = {
      loading: true,
      submitting: false,
      user: null,
      commentTxt: ''
    }

    async fetchData() {
      const { userId } = this.props

      const user = await thinker.fetchUserComplete({ userId })
      // const myFollowings = await apiService.getFollowings({ userId: apiService.authUser()._id })

      this.setState({ loading: false, user })
    }

    componentDidMount() {
      this.fetchData()  
    }

    // async follow() {
    //   const { user } = this.state
    //   await apiService.follow({ userId: user._id })
    // }

    // async unfollow() {
    //   const { user } = this.state
    //   await apiService.unfollow({ userId: user._id })
    // }
    
    render() {
      const { loading, user } = this.state
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
                  <b>0 followers</b> joined on {user.created.substring(0, 10)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {
            user.thoughts.length ? (
              user.thoughts.map(thought => (
                <Grid item xs={10} sm={8} md={6} lg={5} style={{ width: '100%' }}>
                  <ThoughtPaper 
                    thought={thought}
                    onClick={() => history.push(`/user/${user._id}/thought/${thought._id}`)}
                  />
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