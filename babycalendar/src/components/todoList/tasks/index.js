import React, { Component } from 'react'
import Task from './task'

import './styles.css'

class Tasks extends Component {
  render() {
    // console.log('todos:',this.props.todos);
    return (
      <div className="Tasks-container">
        {this.props.todos.map(({ key, style, collaborators, data ,data: { name, isDone} }) => (
          <Task
            style={style}
            onClick={() => this.props.onClick(key, { name, isDone })}
            onRemoveTodo={() => this.props.onRemoveTodo(key)}
            doneIsClicked={isDone}
            key={key}
            name={name}
            collaborators={data.collaborators}
          />
        ))}
      </div>
    )
  }
}

export default Tasks
