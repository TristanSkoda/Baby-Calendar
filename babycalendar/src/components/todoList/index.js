import React, { Component } from 'react'
import { TransitionMotion, spring, presets } from 'react-motion'
import { app} from '../../base';

import './style.css'

import Tasks from './tasks'
import TopBar from './topbar'
import BottomBar from './bottombar'

class App extends Component {
  constructor() {
    super()
    this.database = app.database().ref().child('todos');
    this.state = {
      todos: [],
      topBar: '',
      option: 'All'
    }
  }

  // componentDidMount = () => {
  //   this.fetchData()
  // }

  // fetchData = ()=>{
  //   fetch('http://localhost:4000/api/todos')
  //     .then(data => data.json())
  //     .then(json => this.mapData(json))
  //     .then(goodTodos => {
  //       this.setState({ todos: goodTodos })
  //   })
    
  // }

  componentWillMount(){
    const oldTodos = this.state.todos
    this.database.on('child_added', snap => {
      oldTodos.push({
        _id: snap.key,
        name: snap.val().name,
        isDone: snap.val().isDone
      })
      this.setState({
        todos: oldTodos
      })
    })

    this.database.on('child_removed', snap => {
      for (var i = 0; i < oldTodos.length; i++) {
        if (oldTodos[i].id === snap.key) {
          oldTodos.splice(i,1)
        }
      }
      this.setState({
        todos: oldTodos
      })
    })




    
    // this.database.on('child_changed', snap => {
    //   let newArray = olf.slice();
    //   newArray[indexToUpdate] = {
    //     ...oldArray[indexToUpdate],
    //     field: newValue,
    //   };
    //   let newDataSource = oldDataSource.cloneWithRows(newArray);
    //   this.setState({
    //     todos: newDataSource
    //   })
    // })
    
    
    
    
  }
  
  mapTodos = todos => todos.map(todo => this.mapTodo(todo))
  
  mapTodo = todo => ({
    _id: todo._id,
    key: todo._id,
    data: {
      name: todo.name,
      isDone: todo.isDone
    }
  })
  
  handleOnClick = (id, data)=> {
    const ref = app.database().ref('todos');
    ref.child(id)
    .update({name: data.name, isDone: !data.isDone})

    this.setState({
      todos : () => {
        return app.database.ref('todos')
          .once("value")
          .then(snapshot => snapshot.val())
      }
    })
    // console.log('todos', this.state.todos)
    // const newKey = app.database().ref('todos').push().key
    // const updates = {}
    // updates[`$[id]$[newKey]`] = {name: data.name, isDone: !data.isDone}
    // return app.database().ref('todos').update(updates);
  }
    // var newPostKey = firebase.database().ref().child('posts').push().key;
  
  
  handleAddTodo = name => {this.database.push().set({name: name, isDone: false})
  
  
  // const todos = this.state.todos
  // const newTodo = {
    //   name,
    //   isDone: false 
    // }
    
    // fetch('http://localhost:4000/api/todos', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(newTodo)
    // }).then(todo => todo.json())
    // .then(todo => this.mapData([todo]))
    // .then(goodTodos => {
    //   todos.push(goodTodos[0])
    //   this.setState({ todos })
    // })
    

    
  }

  
  // updateTask = todo => {
  //     const { _id, data: { name, isDone } } = todo
  //     fetch(`http://localhost:4000/api/todo/${_id}`, {
  //         method: 'PUT',
  //         headers: {
  //             'Content-Type': 'application/json'
  //           },
  //           body: JSON.stringify({ _id, data: { name, isDone: !isDone } })
  //         })
  //       }
        
  //     handleOnClick = id => {
  //         this.setState({
  //             todos: this.state.todos.map(todo => {
  //                 const { _id, data: { name, isDone } } = todo
  //                 if (_id === id) {
  //                     this.updateTask(todo)
  //                     return { ...todo, data: { name, isDone: !isDone } }
  //                   } else return todo
  //                 })
  //               })
  //             }



    
    
                
    handleChange = taskName => this.setState({ topBar: taskName })


    handleOnRemoveTodo=todoId=>{this.database.child(todoId).remove()}
                
  // handleOnClickDelete = id => {
  //   fetch(`http://localhost:4000/api/todo/${id}`, {
  //     method: 'DELETE',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   })
  //   this.setState({
  //     todos: this.state.todos.filter(todo => todo._id !== id)
  //   })
  // }

  // deleteAllDone = pIdArray => {
  //   fetch(`http://localhost:4000/api/todo/deleteDone`, {
  //     method: 'post',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(pIdArray)
  //   })
  // }

  // handleClearAllDone = () => {
  //   const idArray = []
  //   this.setState({
  //     todos: this.state.todos.filter(todo => {
  //       const { _id, data: { isDone } } = todo
  //       if (!isDone) {
  //         return true
  //       } else {
  //         idArray.push(_id)
  //         return false
  //       }
  //     })
  //   })
  //   this.deleteAllDone(idArray)
  // }

  handleOption = pOption => this.setState({ option: pOption })


  getDefaultStyles = () =>{
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
        ({data: { name, isDone }}) =>
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
    const { option} = this.state

    return (
      <div className="Todos">
        <h1>Todo List</h1>
        <div className="Todos-container">
          <TopBar onChange={this.handleChange} addTask={this.handleAddTodo}  />

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
