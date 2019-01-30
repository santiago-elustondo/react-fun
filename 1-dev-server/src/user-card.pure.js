import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import MessageIcon from '@material-ui/icons/Message';

const styles = theme => ({
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
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

export const ThoughtCard = withStyles(styles)(({ thought, classes, className, onClick }) => 
  <Card className={className} onClick={onClick}>
    <CardContent>
      <Typography variant="h5" component="h2">
        {thought.user.username}
        {
          thought.comments.length ? (
            <span style={{float:'right', paddingRight: 10}}>
              <Badge style={{ marginLeft: 0}} badgeContent={thought.comments.length} color="primary" classes={{ badge: classes.commentBadge }}>
                <MessageIcon className={classes.commentIcon}/>
              </Badge>
            </span>
          ) : null
        }
      </Typography>
      <Typography className={classes.pos} color="textSecondary">
        {thought.created.substring(0, 10)}
      </Typography>
      <Typography component="p">
        {thought.content}
      </Typography>
    </CardContent>
  </Card>
)