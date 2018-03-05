import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';
import 'font-awesome/css/font-awesome.min.css';

class Header extends Component {

  render() {
    
    console.log('props: ', this.props.authentificated);
    return (
      <div className="header">
        <div className="header-container">
            <div className="header-container-left">
            
            </div>
            <div className="header-container-right">
              {this.props.authentificated ? (
                <div>
                  <Link className="fas fa-list-ul" to="/todos">Todos</Link>
                  <button className="fas fa-user" ></button>
                  <button className="fas fa-ellipsis-v" ></button>
                  <Link className="fas fa-sign-out-alt"  to="/"/>
                </div>
                ) : (
                  <Link  to="/login" >Log In</Link>
                )
            }
            </div>
        </div>
      </div>
    );
  }
}

export default Header;
