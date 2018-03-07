import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './style.css'
import 'font-awesome/css/font-awesome.min.css'

class Header extends Component {
  render() {
    return (
      <div className="header">
        <div className="header-container">
          <div className="header-container-left" />
          <div className="header-container-right">
            <div>
              <Link to="/todos">
                <i className="fas fa-list icons" />
              </Link>
              <button className="fas fa-user icons" />
              <button className="fas fa-ellipsis-v icons" />
              <Link to="/logout">
                <i className="fas fa-sign-out-alt icons" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Header
