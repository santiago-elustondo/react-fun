import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import MessageIcon from '@material-ui/icons/Message'

export const ThoughtCard = React.memo(({ thought, classes, className, onClick }) => 
  <Card className={className} onClick={onClick}>
    <CardContent>
      <Typography variant="h5" component="h2">
        {thought.user.username}
        {
          thought.comments.length ? (
            <span style={{float:'right', paddingRight: 10}}>
              <Badge 
                style={{ marginLeft: 0 }} 
                badgeContent={thought.comments.length} 
                color="primary" 
              >
                <MessageIcon/>
              </Badge>
            </span>
          ) : null
        }
      </Typography>
      <Typography style={{ marginBottom: 12 }} color="textSecondary">
        {thought.created.substring(0, 10)}
      </Typography>
      <Typography component="p">
        {thought.content}
      </Typography>
    </CardContent>
  </Card>
)