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
    // fetch tous les todo d'un user dans le state todos
    this.todosRef.on('child_added', snap => {
      if (
        this._isACollaborator(Object.keys(snap.val().collaborators))
      ) 
      this.setState(currentState=> ({
        todos: [...currentState.todos, {...snap.val(), todoId: snap.key}]
      }))
    })

    // si un enfant d'un todo est delete, on met à jour le state de todos
    this.todosRef.on('child_removed', snap => {
      // console.log('snapVal remove: ',snap.val());
      console.log('remove');
      this.setState(currentState => ({
        todos: [...currentState.todos].filter(todo =>
          todo.todoId !== snap.key
        )
      }))
    })
    
    // TODO: je ne comprends pa l'erreur : quand j'ai deux fenêtre d'ouverte, et que j'appuie sur une des tâches dans l'autre
    // fenêtre la tâche appuyer se change mais ça change aussi la tâche en dessous
    // si un element de la BD n'est pas ajouté ou deleté mais changé, il passe ici
    this.todosRef.on('child_changed', snap => {
      console.log('changed');
      console.log('snapVal changed: ',snap.val());

      if (this._isACollaborator(Object.keys(snap.val().collaborators))) {
        this.setState({
          todos: [...this.state.todos].map(todo => {
            if( todo.todoId === snap.key){
              return {...snap.val(), todoId: snap.key}
            } 
            else {
              return todo
            }
          })
        }) 
      }
      else {
        this.setState(currentState => ({
          todos: [...currentState.todos].filter(todo =>
            todo.todoId !== snap.key
          )
        }))
      }
    })

    // fetch tous les user de la BD dans le state users
    this.usersRef.on('child_added', snap => {
      this.setState({
        users: [...this.state.users, snap.val()]
      })
    })
  }

  // fonction de test. regarde si le uid du user connecter se trouve dans les collaborateurs du todo.
  _isACollaborator = collaborators =>
    collaborators.some(collaborator =>{
     return collaborator === this.props.user.uid
    })

  // prends la liste de todo récupéré de la BD et les map pour qu'il fonctionne avec transition motion
  _mapTodos = todos => todos.map(todo => this._mapTodo(todo))
  
  // enregistre l'option choisie par lutilisateur dans la bottom bar.
  _handleOption = pOption => this.setState({ option: pOption })
  
  // enregistre chaque lettres entré dans la top bar.
  _handleChange = taskName => this.setState({ topBar: taskName })
  
  // prends la liste de collaborateur et la rends fonctionnel pour le programme.
  _mapCollaborators = (collaborators) =>{
    const newCollaborators = []
    Object.keys(collaborators).forEach(collaborator => {
      this.state.users.forEach(user => {
        if (user.uid === collaborator) {
          newCollaborators.push({
            email: user.email,
            collaborator: collaborator
          })
        }
      })
    })
    return newCollaborators
  }

  // prends un todo récupéré de la BD et le map pour qu'il fonctionne avec transition motion
  _mapTodo = todo => ({
    key: todo.todoId,
    data: {
      userId: todo.userId,
      collaborators: this._mapCollaborators(todo.collaborators),
      name: todo.name,
      isDone: todo.isDone
    }
  })

  // quand l'utilisateur click sur le nom de la todo pour la indiquer que la tâche est complété 
  _handleOnClick = (id, data) => {
    this.todosRef.child(id).update({ name: data.name, isDone: !data.isDone })
    this.setState({
      todos: this.state.todos.map(todo => {
        const { todoId, isDone } = todo
        if (todoId === id) return { ...todo, isDone: !isDone }
        else return todo
      })
    })
  }

  // on ajoute le nouveau todo dans la BD
  _handleAddTodo = name => {
    this.todosRef.push({
      name: name,
      collaborators:{
        [this.props.user.uid]:true
      },
      isDone: false,
      userId: this.props.user.uid
    })
  }

  // quand le user appuie sur delete, on supprime le todo de la BD
  _handleOnRemoveTodo = (todoId, userId) => {
    // TODO:  si il est le créateur du todo on le supprime pour vraie. si non, on l'enlève des collaborateurs.

    if (this.props.user.uid === userId) {
      this.todosRef.child(todoId).remove()
    } else{
      this._handleRemoveACollaborator(todoId, this.props.user.uid)
    }
  }

  // on ajoute le collaborateur choisie a la todo dans la BD.
  _handleAddACollaborator = (todoId, userId) =>{
    this.todosRef
      .child(todoId)
      .child('collaborators')
      .update({
        [userId]: true
      })
    }

    // on supprime le collaborateur choisie de la tâche en BD
    _handleRemoveACollaborator = (todoId, userId)=> {

      this.todosRef
      .child(todoId)
      .child('collaborators')
      .child(userId)
      .remove()
    }
  
  // supprime tous les todo qui son indiqué comme complété.
  _handleClearAllDone = () => {
    this.setState({
      todos: this.state.todos.filter(todo => {
        const { todoId, isDone } = todo
        if (!isDone) return true
        else {
          this._handleOnRemoveTodo(todoId)
          return false
        }
      })
    })
  }

  // cette fonction est la pour le transition motion.
  // il donne la valeur de dépar du component Task.
  _getDefaultStyles = () => 
    this._mapTodos(this.state.todos).map(todo => (
      {
        ...todo,
        style: { height: 0, opacity: 1 }
      }
    ))
  
  // aussi pour transition motion : la valeur de fin du component.
  _getListTodoAndStyle = () => {
    const { topBar, option, todos } = this.state
    const allo = this._mapTodos(todos)
    console.log('maped Todos: ', allo);
    return allo
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

  _willEnter() {
    return {
      height: 0,
      opacity: 1
    }
  }

  _willLeave() {
    return {
      height: spring(0),
      opacity: spring(0)
    }
  }

  render() {
    const { option } = this.state
    console.log('todos: ', this.state.todos);
    return (
      <div className="Todos">
        <h1>Todo List</h1>
        <div className="Todos-container">
          <TopBar onChange={this._handleChange} addTask={this._handleAddTodo} />

          <TransitionMotion
            defaultStyles={this._getDefaultStyles()}
            styles={this._getListTodoAndStyle()}
            willLeave={this._willLeave}
            willEnter={this._willEnter}
          >
            {styles => (
              <Tasks
              
                todos={styles}
                addACollaborator={this._handleAddACollaborator}
                removeACollaborator={this._handleRemoveACollaborator}
                onRemoveTodo={this._handleOnRemoveTodo}
                onClick={this._handleOnClick}
              />
            )}
          </TransitionMotion>

          <BottomBar
            onClick={this._handleOption}
            option={option}
            onClickClearAllDone={this._handleClearAllDone}
          />
        </div>
      </div>
    )
  }
}
export default App
