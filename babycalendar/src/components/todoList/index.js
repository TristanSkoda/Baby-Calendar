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
    this.usersRef = this.ref.child('users')    
    this.todosRef = this.ref.child('todos')

    this.state = {
      todos: [],
      topBar: '',
      option: 'All',
      users: []
    }
  }
  /* 
    1. si tu n'est pas le créateur du todo, tu ne peux pas add des collaborateurs au todo.
    2. quand tu supprim un todo dont tu étais collaborateur, tu enlève la collaboration à ce todo.
    3.
   */

  componentWillMount() {
    this.todosRef.on('child_added', snap => {
      console.log('added');
      if (
        this.props.user.uid === snap.val().userId ||
        this.isACollaborator(Object.keys(snap.val().collaborators))
      ) 
      this.setState({
        todos: [...this.state.todos, {...snap.val(), todoId: snap.key}]
      })
    })

    this.todosRef.on('child_removed', snap => {
      console.log('removed');
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
      console.log('changed');
      const newTodos = oldTodos.map(todo => {
        return todo.todoId === snap.key ? snap.val() : todo
      })
      this.setState({
        todos: newTodos
      })
    })

   
    
    this.usersRef.on('child_added', snap => {
      this.setState({
        users: [...this.state.users, snap.val()]
      })
    })
  }

  isACollaborator = collaborators =>
    collaborators.some(collaborator => collaborator === this.props.user.uid)

  mapTodos = todos => todos.map(todo => this.mapTodo(todo))

  handleOption = pOption => this.setState({ option: pOption })

  handleChange = taskName => this.setState({ topBar: taskName })

  mapCollaborators = (collaborators) =>{
    console.log('users',this.state.users);
    console.log('users',this.state.users[0]);
    console.log('users2',this.state.users[1]);

    this.state.users.forEach(user => {
      console.log('uid', user.uid);
    })
    const mapCollaborators = []
    // console.log('users',this.state.users);
    // console.log('collaborators : ',collaborators);
    Object.keys(collaborators).forEach(collaborator => {
      // console.log('collab1', collaborator);
      this.state.users.forEach(user => {
        // console.log('uid', user.uid);
        // console.log('collab2', collaborator);
        if (user.uid === collaborator) {
          mapCollaborators.push({
            email: user.email,
            collaborator: collaborator
          })
        }
      })
    })
    return mapCollaborators
  }

  mapTodo = todo => ({
    todoId: todo.todoId,
    key: todo.todoId,
    data: {
      userId: todo.userId,
      collaborators: this.mapCollaborators(todo.collaborators),
      name: todo.name,
      isDone: todo.isDone
    }
  })


  handleOnClick = (id, data) => {
    this.todosRef.child(id).update({ name: data.name, isDone: !data.isDone })
    this.setState({
      todos: this.state.todos.map(todo => {
        const { todoId, name, isDone } = todo
        if (todoId === id) return { ...todo, isDone: !isDone }
        else return todo
      })
    })
  }

  handleAddTodo = name => {
    this.todosRef.push({
      name: name,
      collaborators:{
        [this.props.user.uid]:true
      },
      isDone: false,
      userId: this.props.user.uid
    })
  }

  handleOnRemoveTodo = todoId => {
    // si il est le créateur du todo on le supprime pour vraie. si non, on l'enlève des collaborateurs.
    this.todosRef.child(todoId).remove()
  }
  handleAddACollaborator = (todoId, userId) =>{
    this.todosRef
      .child(todoId)
      .child('collaborators')
      .update({
        [userId]: true
      })
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
    console.log('not maptodo: ', this.state.todos);
    console.log('maptodos: ', mapedTodos)

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
                addACollaborator={this.handleAddACollaborator}
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
