import React from 'react'
import { withRouter } from 'react-router-dom'
import { Grid, Typography, Paper, Badge, withStyles } from '@material-ui/core'
import MessageIcon from '@material-ui/icons/Message'

const styles = theme => ({
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

export const ThoughtPaper = React.memo(withRouter(withStyles(styles)(
  ({ thought, classes, onClick }) => 
    <Paper 
      style={{padding:'10px'}} 
      className={classes.thoughtCard} 
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
                    classes={{ badge: classes.commentBadge }}
                  >
                    <MessageIcon className={classes.commentIcon}/>
                  </Badge>
                ) : null
              }
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
)))