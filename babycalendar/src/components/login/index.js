import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
// import { Toaster, Intent } from '@blueprintjs/core';
import { app } from '../../base'

import './style.css'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false
    }
  }

  _authWithEmailAndPassword = event => {
    event.preventDefault()
    const email = this.emailInput.value
    const password = this.passwordInput.value
    app
      .auth()
      .fetchProvidersForEmail(email)
      .then(providers => {
        if (providers.length === 0) {
          // creat user
          return app.auth().createUserWithEmailAndPassword(email, password)
        } else {
          return app.auth().signInWithEmailAndPassword(email, password)
        } // sign user in
      })
      .then(user => {
        if (user && user.email) {
          this.loginForm.reset()
          this.setState({ redirect: true })
        }
      })
      .catch(error => {
        console.log(error.message)
        // this.toaster.show({intent: Intent.DANGER, message: error.message })
      })
  }

  render() {
    if (this.state.redirect === true) {
      return <Redirect to="/" />
    }
    return (
      <div className="login">
        {/* <Toaster ref={element => this.toaster = element} /> */}
        <div className="login-container">
          <div className="signin">
            <div className="signin-container">
              <h1>Sign In</h1>
              <form
                onSubmit={this._authWithEmailAndPassword}
                ref={form => {
                  this.loginForm = form
                }}
              >
                <input
                  placeholder="Name / Email"
                  name="email"
                  type="email"
                  ref={input => {
                    this.emailInput = input
                  }}
                />
                <input
                  placeholder="Password"
                  name="password"
                  type="password"
                  ref={input => {
                    this.passwordInput = input
                  }}
                />
                <input
                  className="submitinput"
                  value="Sign In"
                  readOnly={true}
                  type="submit"
                />
              </form>
              <a href="">Forgot your password?</a>
            </div>
          </div>
          <div className="signup">
            <div className="signup-container">
              <h1>Sign Up</h1>
              <p>
                If you want to sign up, you juste need to enter your
                informations in the sign in section.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
