import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import { Grid, TextField, LinearProgress, Typography, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import { apiService } from 'api/service.singleton'
import { ThoughtCard } from './user-card.pure'
import { screenWidth, SCREEN_SIZE } from 'screen-width.broadcaster'

// @todo put in utils.js
const arrayOf = length => (new Array(length)).fill(true)

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
  }
})

export const FindUsers = withRouter(withStyles(styles)(
  class extends Component {

    state = {
      loading: true,
      submitting: false,
      users: [],
      thoughts:[],
      searchString: '',
      thoughtTxt: '',
      numberOfCols: this.deriveNumberOfCols()
    }

    constructor() {
      super()
      screenWidth.emitter.subscribe((size) => {
        console.log(size)
        this.setState({
          numberOfCols: this.deriveNumberOfCols()
        })
      })
    }

    deriveNumberOfCols() {
      return screenWidth.isBiggerOrEqualTo(SCREEN_SIZE.TABLET_SM) ? 3 : 2
    }

    async fetchData() {

      const users = await apiService.listUsers()

      const userThoughts = await Promise.all(
        users.map(u => apiService.listUserThoughts({ userId: u._id }))
      )

      const usersWithThoughts = users.map(
        (u, i) => Object.assign(u, { thoughts: userThoughts[i] })
      )

      const allThoughts = userThoughts.reduce((allThoughts, thoughtsOfUser, i) => 
        allThoughts.concat(
          thoughtsOfUser.map(thought => Object.assign(thought, { 
            user: users[i]
          }))
        ), [])

      const commentsForThoughts = await Promise.all(
        allThoughts.map(t => apiService.getComments({ thoughtId: t._id, userId: t.user._id }))
      )

      allThoughts.forEach((thought, i) => thought.comments = commentsForThoughts[i])
      allThoughts.sort((a, b) => Date.parse(a.created) < Date.parse(b.created) ? 1 : -1 )

      this.setState({ 
        loading: false, 
        users: usersWithThoughts,
        thoughts: allThoughts
      })
    }

    async submitThought() {
      const { thoughts, thoughtTxt } = this.state

      this.setState({
        submitting: true
      })

      const thought = await apiService.addThought({ 
        content: thoughtTxt
      })

      this.setState({
        submitting: false,
        thoughts: [thought].concat(thoughts)
      })
    }

    componentDidMount() {
      this.fetchData()  
    }
    
    render() {
      const { thoughts, searchString, loading, thoughtTxt, numberOfCols } = this.state
      const { classes, history } = this.props

      const filteredThoughts = thoughts.filter(t => t.content.includes(searchString))
    
      console.log(arrayOf(numberOfCols))

      return loading ? (
        <LinearProgress /> 
      ) : (
        <Grid container direction='column' alignItems='center'>
          <Grid item xs={12} sm={4} lg={4} className={classes.root} align='left' style={{ width: '100%', paddingLeft: '15px', paddingRight: '15px' }}>
            <Typography variant='h6' style={{ marginTop: '20px' }}> What are you thinking about? </Typography>
            <TextField
              fullWidth
              multiline
              value={thoughtTxt}
              onChange={e => this.setState({ thoughtTxt: e.target.value })}
              placeholder='Share your thoughts'
              variant="outlined"
            />
            <div align={'right'} style={{ marginTop:'2px' }}>
              <Button onClick={() => this.submitThought()}>
                Submit
              </Button>
            </div>
          </Grid>
          <Grid item xs={12} sm={10} lg={8} className={classes.root} align='left' style={{ width: '100%', paddingLeft: '15px', paddingRight: '15px' }}>
            <TextField
              label="Find a Thought"
              className={classes.textField}
              value={searchString}
              onChange={e => this.setState({ searchString: e.target.value })}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={10} lg={8} style={{width: '100%'}}>
            <Grid container className={classes.root} spacing={16} justify="space-around" alignItems="left" style={{ width:'100%' }}>
              {
                arrayOf(numberOfCols).map((_, columnIndex) => 
                  <Grid key={columnIndex} item xs={12 / numberOfCols}>
                    <Grid container direction="column" spacing={16}>
                    {
                      filteredThoughts
                        .filter((t, i) => (i % numberOfCols) === columnIndex)
                        .map(t => (
                          <Grid item
                            key={'2_' + t._id}  
                            xs={12}
                          >
                            <ThoughtCard 
                              thought={t}                      
                              className={classes.thoughtCard}
                              onClick={() => history.push(`/user/${t.user._id}/thought/${t._id}`)}
                            />
                          </Grid>
                        ))
                    }
                    </Grid>
                  </Grid>
                )
              }
            </Grid>
          </Grid>
        </Grid>
      )
    }
  }
))