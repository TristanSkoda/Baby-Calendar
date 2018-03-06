import React, { Component } from 'react'

import './styles.css'

class TopBar extends Component {
  constructor(props) {
    super(props)

    this.state = { value: '' }
  }
  handleChange = event => {
    this.setState({ value: event.target.value })

    this.props.onChange(event.target.value)
  }

  handleSubmit = event => {
    event.preventDefault()

    if (this.state.value !== '') {
      this.props.addTask(this.state.value)
    }
  }

  render() {
    return (
      <div className="topbar-container">
        <form onSubmit={this.handleSubmit} className="topbar-container-form">
          <input
            type="text"
            onChange={this.handleChange}
            placeholder="Enter a task"
          />
          <button>Submit</button>
        </form>
      </div>
    )
  }
}

export default TopBar
