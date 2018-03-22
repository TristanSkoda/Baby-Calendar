import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { app } from './base'
import { Spinner } from '@blueprintjs/core'


import './css/style.css'
import './css/general.css'
import './css/reset.css'

import Todos from './components/todoList/'
import Logout from './components/logout'
import Login from './components/login'
import Header from './components/header'



class App extends Component {
  constructor() {
    super()

    this.ref = app.database().ref('baby-calendar')
    this.usersRef = this.ref.child('users')
    this.state = {
      user: {},
      loading: true
    }
  }
  componentWillMount() {
    app.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('user: ',user);
        this.usersRef.child(user.uid).set({
          email: user.email,
          uid: user.uid
        })
        this.setState({
          user: user,
          loading: false
        })
      } else {
        console.log('no user: ');
        this.setState({
          user: null,
          loading: false
        })
      }
    })
  }

  componentWillUnmount() {
    this.removeAuthListener()
  }

  render() {
    if (this.state.loading === true) {
      return (
        <div className="loading">
          <h3>Loading</h3>
          <Spinner />
        </div>
      )
    }
    return (
      <div className="App">
        <BrowserRouter>
          <div className="app-container">
            {this.state.user ? <Header /> : null}
            <Route exact path="/login" component={Login} />
            <Route exact path="/logout" component={Logout} />
            <Route
              exact
              path="/todos"
              render={() => <Todos user={this.state.user} />}
            />
          </div>
        </BrowserRouter>
      </div>
    )
  }
}
export default App
