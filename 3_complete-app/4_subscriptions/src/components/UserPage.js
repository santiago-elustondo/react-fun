import React from 'react'
import { withRouter } from 'react-router-dom'
import { Grid, LinearProgress, Typography } from '@material-ui/core'

import { thinker } from 'thinker-sdk.singleton'
import { ThoughtPaper } from './ThoughtPaper'

export const UserPage = withRouter(class extends React.PureComponent {

    state = {
      loading: true,
      submitting: false,
      user: null,
      commentTxt: ''
    }

    async fetchData() {
      const { userId } = this.props
      const user = await thinker.fetchUserComplete({ userId })
      this.setState({ loading: false, user })
    }

    componentDidMount() {
      this.fetchData()  
    }
    
    render() {
      const { loading, user } = this.state
      const { history } = this.props
    
      return loading ? (
        <LinearProgress /> 
      ) : (
        <Grid container direction="column" spacing={16} alignItems={'center'}>
          <Grid item xs={10} sm={8} md={6} lg={5} style={{ width: '100%', marginTop: '30px'}}>
            <Grid container justify="space-between">
              <Grid item xs={6}>
                <Typography 
                  variant='h5' 
                  className='username'
                  onClick={() => history.push(`/user/${user._id}`)}
                >
                  {user.username} 
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
)