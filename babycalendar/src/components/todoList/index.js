import React, { Component } from 'react'
import { TransitionMotion, spring, presets } from 'react-motion'
import { app } from '../../base'

import './style.css'

import Tasks from './tasks'
import TopBar from './topbar'
import BottomBar from './bottombar'

class App extends Component {
  constructor(props) {
    super(props)
    this.ref = app.database().ref('baby-calendar')
    this.todosRef = this.ref.child('todos')
    

    this.state = {
      todos: [],
      topBar: '',
      option: 'All'
    }
  }

  componentWillMount() {
    
    console.log('this.props.user: ', this.props.user);
    const oldTodos = this.state.todos
    this.todosRef.on('child_added', snap => {
      if (this.props.user.uid === snap.val().userId || this.isACollaborator(Object.keys(snap.val().collaborators))) {
        oldTodos.push({
          ...snap.val(),
          todoId: snap.key
        })
      }
      this.setState({
        todos: oldTodos
      })
    })

    this.todosRef.on('child_removed', snap => {
      for (var i = 0; i < oldTodos.length; i++) {
        if (oldTodos[i].todoId === snap.key) oldTodos.splice(i, 1)
      }
      this.setState({
        todos: oldTodos
      })
    })


    // TODO: je ne comprends pa l'erreur : quand j'ai deux fenêtre d'ouverte, et que j'appuie sur une des tâches dans l'autre
    // fenêtre la tâche appuyer se change mais ça change aussi la tâche en dessous
    
    this.todosRef.on('child_changed', snap => {
      const newTodos = oldTodos.map(todo => {
        return todo.todoId === snap.key
          ? snap.val()
          : todo
      })
      this.setState({
        todos: newTodos
      })
    })
  }

  isACollaborator = collaborators => collaborators.some(collaborator => collaborator === this.props.user.uid)

  mapTodos = todos => todos.map(todo => this.mapTodo(todo))

  handleOption = pOption => this.setState({ option: pOption })  

  handleChange = taskName => this.setState({ topBar: taskName })
  

  
  mapTodo = todo => 
  ({
      todoId: todo.todoId,
      key: todo.todoId,
      data: {
        collaborators: todo.collaborators,
        name: todo.name,
        isDone: todo.isDone
      }
    })
  

  handleOnClick = (id, data) => {
    this.todosRef.child(id).update({ name: data.name, isDone: !data.isDone })
 
    // à enlever TEST pour modifier les collaborateurs.
    this.todosRef.child(id).child('collaborators').update({
      Z0xoQpRgMJRaZgCfi2Fd1V7Fug93: true,
      Z0xoQpRgMJRaZgCfi2Fd1V7Fug92: true
    })

    this.setState({
      todos: this.state.todos.map(todo => {
        const { todoId, name, isDone } = todo
        if (todoId === id) return { todoId, name, isDone: !isDone }
        else return todo
      })
    })
  }

  handleAddTodo = name => {
    this.todosRef.push({
      name: name,
      isDone: false,
      collaborators:{
        Z0xoQpRgMJRaZgCfi2Fd1V7Fug92: true
      },
      userId: this.props.user.uid
    })

    this.todosRef.ref('-L88r_NP8cxnMM_pJr0l').child('collaborators').push({
      Z0xoQpRgMJRaZgCfi2Fd1V7Fug93: true
    })
  }

  handleOnRemoveTodo = todoId => {
    this.todosRef.child(todoId).remove()
  }

  handleClearAllDone = () => {
    this.setState({
      todos: this.state.todos.filter(todo => {
        const { todoId, isDone } = todo
        if (!isDone) return true
        else {
          this.handleOnRemoveTodo(todoId)
          return false
        }
      })
    })
  }


  getDefaultStyles = () => {
    const mapedTodos = this.mapTodos(this.state.todos)
    console.log('todos: ',mapedTodos);

    return mapedTodos.map(todo => ({
      ...todo,
      style: { height: 0, opacity: 1 }
    }))
  }

  getListTodoAndStyle = () => {
    const { topBar, option, todos } = this.state
    return this.mapTodos(todos)
      .filter(
        ({ data: { name, isDone } }) =>
          name.includes(topBar) &&
          ((option === 'Done' && isDone) ||
            (option === 'Active' && !isDone) ||
            option === 'All')
      )
      .map(todo => ({
        ...todo,
        style: {
          height: spring(60, presets.gentle),
          opacity: spring(1, presets.gentle)
        }
      }))
  }

  willEnter() {
    return {
      height: 0,
      opacity: 1
    }
  }

  willLeave() {
    return {
      height: spring(0),
      opacity: spring(0)
    }
  }

  render() {
    const { option } = this.state
    return (
      <div className="Todos">
        <h1>Todo List</h1>
        <div className="Todos-container">
          <TopBar onChange={this.handleChange} addTask={this.handleAddTodo} />

          <TransitionMotion
            defaultStyles={this.getDefaultStyles()}
            styles={this.getListTodoAndStyle()}
            willLeave={this.willLeave}
            willEnter={this.willEnter}
          >
            {styles => (
              <Tasks
                todos={styles}
                onRemoveTodo={this.handleOnRemoveTodo}
                onClick={this.handleOnClick}
              />
            )}
          </TransitionMotion>

          <BottomBar
            onClick={this.handleOption}
            option={option}
            onClickClearAllDone={this.handleClearAllDone}
          />
        </div>
      </div>
    )
  }
}
export default App
