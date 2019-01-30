import React from 'react'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core'

const styles = {}

export const App = withRouter(withStyles(styles)(
  class extends React.PureComponent {
    render() {
      return (
        <h1> hello </h1>
      )
    }
  }
))