import React from 'react'
import { withRouter } from 'react-router-dom'
import { Grid, Typography, Paper, Badge } from '@material-ui/core'
import MessageIcon from '@material-ui/icons/Message'

import './ThoughtPaper.css'

export const ThoughtPaper = React.memo(withRouter(
  ({ thought, classes, onClick }) => 
    <Paper 
      style={{padding:'10px'}} 
      className='thought-paper' 
      onClick={onClick}
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
                  <Badge style={{ marginLeft: 0}} 
                    badgeContent={thought.comments.length} 
                    color="primary" 
                  >
                    <MessageIcon/>
                  </Badge>
                ) : null
              }
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
))