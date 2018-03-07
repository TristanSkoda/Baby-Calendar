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
    const oldTodos = this.state.todos
    this.todosRef.on('child_added', snap => {
      oldTodos.push({
        userId: this.props.user.uid,
        todoId: snap.key,
        name: snap.val().name,
        isDone: snap.val().isDone
      })
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

    this.todosRef.on('child_changed', snap => {
      const newTodos = oldTodos.map(todo => {
        return todo.todoId === snap.key
          ? { ...todo, isDone: todo.isDone }
          : todo
      })
      this.setState({
        todos: newTodos
      })
    })
  }

  mapTodos = todos => todos.map(todo => this.mapTodo(todo))

  mapTodo = todo => ({
    todoId: todo.todoId,
    key: todo.todoId,
    data: {
      name: todo.name,
      isDone: todo.isDone
    }
  })

  handleOnClick = (id, data) => {
    this.todosRef.child(id).update({ name: data.name, isDone: !data.isDone })

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
      userId: this.props.user.uid
    })
  }

  handleChange = taskName => this.setState({ topBar: taskName })

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

  handleOption = pOption => this.setState({ option: pOption })

  getDefaultStyles = () => {
    const mapedTodos = this.mapTodos(this.state.todos)

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
