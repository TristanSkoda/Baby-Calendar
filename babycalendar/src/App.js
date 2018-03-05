import React, { Component } from 'react';
import {BrowserRouter, Route } from 'react-router-dom';
import { app} from './base';
import { Spinner} from '@blueprintjs/core';


import './css/style.css';
import './css/general.css';
import './css/reset.css';

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
      console.log('user', user);
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
    console.log('auth.app:', this.state.authenticated);
    return (
      
      <div className="App">
        <BrowserRouter>
          <div className="app-container" >
            <Header authenticated={this.state.authenticated} />
            
              <Route exact path="/login" component={Login} />
              <Route exact path="/logout" component={Logout} />
              
            
              {/* todo Component */}
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
export default App;
