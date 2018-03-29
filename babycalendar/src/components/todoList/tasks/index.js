import React, { Component } from 'react'
import Task from './task'

import './styles.css'

class Tasks extends Component {
  render() {
    // console.log('todos:',this.props.todos);
    return (
      <div className="Tasks-container">
        {this.props.todos.map(
          ({ key, style, data: {collaborators, userId, name, isDone } }) => (
            <Task
              style={style}
              onClick={() => this.props.onClick(key, { name, isDone })}
              onRemoveTodo={() => this.props.onRemoveTodo(key, userId)}
              addACollaborator={idOfUser =>this.props.addACollaborator(key, idOfUser)}
              removeACollaborator={idOfUser=> this.props.removeACollaborator(key, idOfUser)}
              doneIsClicked={isDone}
              key={key}
              todoId={key}
              collaborators={collaborators}
              userId={userId}
              name={name}
            />
          )
        )}
      </div>
    )
  }
}

export default Tasks
