import React, { Component } from 'react';
import {BrowserRouter, Route } from 'react-router-dom';
import { app} from './base';
import { Spinner} from '@blueprintjs/core';


import './css/style.css';
import './css/general.css';
import './css/reset.css';

import Todos from './components/todoList/';
import Logout from './components/logout';
import Login from './components/login';
import Header from './components/header';



class App extends Component {
  constructor(){
    super()
    this.state = {
      authenticated: false,
      loading: true
    }
  }
  componentWillMount(){
    this.removeAuthListener = app.auth().onAuthStateChanged(user=>{ 
      if (user) {
        this.setState({
          authenticated: true,
          loading: false
        })
      }else {
        this.setState({
          authenticated: false,
          loading: false
        }) 
      }
    })
    
  }



  componentWillUnmount(){
    this.removeAuthListener();
  }

  render() {
    if(this.state.loading === true){
      return (
        <div className="loading">
          <h3>Loading</h3>
          <Spinner/>
        </div>
      )
    }
    return (
      <div className="App">
        <BrowserRouter>
          <div className="app-container" >
              {this.state.authenticated ? <Header />: null}
              <Route exact path="/login" component={Login} />
              <Route exact path="/logout" component={Logout} />
              <Route exact path="/todos" component={Todos} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
export default App;
