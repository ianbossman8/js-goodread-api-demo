import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      err: '',
    }
  }

  componentDidCatch(err) {
    this.setState({
      err,
    })
  }

  render() {
    if (this.state.err) {
      return <Redirect to="/" />
    }
    return this.props.children
  }
}

export default ErrorBoundary
