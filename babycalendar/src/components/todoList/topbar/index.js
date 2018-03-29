import React, { Component } from 'react'

import './styles.css'

class TopBar extends Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }
  }
  
  _handleChange = event => {
    this.setState({ value: event.target.value })

    this.props.onChange(event.target.value)
  }

  _handleSubmit = event => {
    event.preventDefault()

    if (this.state.value !== '') {
      this.props.addTask(this.state.value)
    }
  }

  render() {
    return (
      <div className="topbar-container">
        <form onSubmit={this._handleSubmit} className="topbar-container-form">
          <input
            type="text"
            onChange={this._handleChange}
            placeholder="Enter a task"
          />
          <button>Submit</button>
        </form>
      </div>
    )
  }
}

export default TopBar
