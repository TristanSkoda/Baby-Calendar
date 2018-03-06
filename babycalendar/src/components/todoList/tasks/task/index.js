import React, { Component } from 'react'

import './styles.css'

class Task extends Component {
  handleRemoveTodo = event => {
    event.stopPropagation()
    this.props.onRemoveTodo()
  }
  render() {
    return (
      <div
        style={this.props.style}
        className={
          this.props.doneIsClicked
            ? 'task-isClicked task-container'
            : ' task-container'
        }
        onClick={this.props.onClick}
      >
        <h2> {this.props.name} </h2>
        <button onClick={this.handleRemoveTodo}>Delete</button>
      </div>
    )
  }
}

export default Task
