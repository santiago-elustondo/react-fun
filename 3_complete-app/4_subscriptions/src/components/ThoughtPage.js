import React from 'react'
import { withRouter } from 'react-router-dom'
import { Grid, TextField, LinearProgress, Typography, Paper, Button } from '@material-ui/core'

import { thinker } from '../thinker-sdk.singleton'

import './ThoughtPage.css'

export const ThoughtPage = withRouter(class extends React.PureComponent {

    state = {
      loading: true,
      submitting: false,
      thought: null,
      commentTxt: ''
    }

    async fetchData() {
      const { thoughtId, userId } = this.props

      const thought = await thinker.fetchThought({ thoughtId, userId })
      this.setState({ loading: false, thought })
    }

    async submitComment() {
      const { thoughtId, userId } = this.props
      const { commentTxt, thought } = this.state

      this.setState({ submitting: true })
      const comment = await thinker.addComment({ thoughtId, userId, content: commentTxt })

      this.setState({ 
        submitting: false,
        commentTxt: '',
        thought: {
          ...thought,
          comments: [comment].concat(thought.comments),
        }
      })
    }

    componentDidMount() {
      const { userId, thoughtId } = this.props
      this.fetchData() 
      thinker.subscribeToComments({
        thoughtId, userId, 
        handler: this._handleComments
      })
    }

    componentWillUnmount() {
      const { userId, thoughtId } = this.props
      thinker.unsubscribeToComments({
        thoughtId, userId, 
        handler: this._handleComments
      })
    }

    _handleComments = (comments) => {
      const { thought } = this.state
      this.setState({ 
        thought: {
          ...thought,
          comments: comments,
        }
      })
    }

    render() {
      const { thought, loading, commentTxt } = this.state
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
                  onClick={() => history.push(`/user/${thought.user._id}`)}
                >
                  {thought.user.username}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant='h5' align="right">
                  {thought.created.substring(0, 10)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={10} sm={8} md={6} lg={5} style={{ width: '100%' }}> 
            <Typography variant='body1'>
              {thought.content}
            </Typography>
          </Grid>
          <Grid item xs={10} sm={8} md={6} lg={5} style={{ width: '100%', marginTop: '10px' }}>
            <Grid container justify="space-between">
              <Grid item xs={10}>
                <TextField 
                  fullWidth
                  multiline
                  value={commentTxt}
                  onChange={e => this.setState({ commentTxt: e.target.value })}
                  placeholder='Leave a comment'
                />
              </Grid>
              <Grid item xs={2}  style={{ position: 'relative' }}>
                <Button 
                  style={{ width: '100%', position: 'absolute', bottom: 0 }}
                  onClick={() => this.submitComment()}
                > 
                  Submit 
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {
            thought.comments.length ? (
              thought.comments.map(c => (
                <Grid key={c._id} item xs={10} sm={8} md={6} lg={5} style={{ width: '100%' }}>
                  <Paper style={{padding:'10px'}}>
                    <Grid container>
                      <Grid container justify="space-between">
                        <Grid item xs={6}>
                          <Typography 
                            variant='body1' 
                            className='username' 
                            onClick={() => history.push(`/user/${c.user._id}`)}
                          >
                            <b>{c.user.username}</b>
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant='body1' align="right">
                            {c.created.substring(0, 10)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Typography variant='body1' style={{ marginTop: '10px' }}>
                      {c.content}
                    </Typography>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Grid item xs={4} style={{ width: '100%', margin: '10px' }}>
                <Typography variant='body1' style={{color:'gray'}} align='center'>
                  (no comments)
                </Typography>
              </Grid>
            )
          }
        </Grid>
      )
    }
  }
)