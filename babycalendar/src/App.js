import React, { Component } from 'react';

import './css/styles.css';
import './css/general.css';
import './css/reset.css';

import { base } from './base';


class App extends Component {
  render() {
    return (
      <div className="App">
       <div className="login">
        <div className="login-container">
          <div className="signin">
            <div className="signin-container">
              <h1>Sign In</h1>
              <form action="" onSubmit={this.handleSubmit}>
                <input placeholder='Name / Email' type="text"/>
                <input placeholder='******' type="password"/>
                <input type="submit" >Sign In</input >
              </form>
              <a href="">Forgot your password?</a>
            </div>
          </div>
          <div className="signup">
            <div className="signup-container">
              <h1></h1>
              <p></p>
              <button type='submit'>Sign Up</button>
            </div>
          </div>
        </div>
       </div>
      </div>
    );
  }
}
// http://verdewall.com/wp-content/uploads/2017/05/City-Background-403.jpg
export default App;
