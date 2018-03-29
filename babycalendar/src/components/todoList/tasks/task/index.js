import React, { Component } from 'react'
import Modal from 'react-modal'
import { app } from '../../../../base'

import './styles.css'
import './modal.css'
// TODO:
// le style pour le component Modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex'
  }
}

Modal.setAppElement('#root')

class Task extends Component {
  constructor(props) {
    super(props)

    this.ref = app.database().ref('baby-calendar')
    this.usersRef = this.ref.child('users')    
    this.todosRef = this.ref.child('todos')

    this.state = {
      value: '',
      modalIsOpen: false,
      users: [],
      user: {}
    }
  }

  componentWillMount = () => {

    app.auth().onAuthStateChanged(user =>{
      this.setState({
        user: user
      })
    })

    // fetch tous les user de la BD dans le state users
    this.usersRef.on('child_added', snap => {
      this.setState(currentState=>({
        users: [...currentState.users, snap.val()]
      }))
    })
  }

  _openModal = () => {
    this.setState({
      modalIsOpen: true,
    })
  }

  _closeModal = () => {
    this.setState({ modalIsOpen: false })
  }

  // retourne les email des users.
  _getUsersEmail = () =>
    this.state.value !== ''
      ? this.state.users.filter(user => user.email.includes(this.state.value))
      : []

  // enregistre le input pour les collab.
  _handleChange = event => {
    this.setState({ value: event.target.value })
  }

  
  // prends le email clicker et le met dans le input.
  _handleClickOnEmail = data => {
    this.setState({ value: data })
  }

  _handleSubmit = event => {
    event.preventDefault()
    this.state.users.forEach(user => {
      user.email === this.state.value
        ? // add le uid du user dans la bd dans les collaborateurs de la todo
          this.props.addACollaborator(user.uid)
        : null
    })
  }

  // avec le email entré dans le input on regarde il appartient à qui et on envoie son uid
  _handleRemoveCollaborator = event =>{
    event.preventDefault()
    this.state.users.forEach(user => {
      (user.email === this.state.value && user.uid !== this.props.userId)
        ? // supprime le uid du user dans la BD dans les collaborateurs de la tâche
          this.props.removeACollaborator(user.uid)
        : null
    })
  }

 
  render() {
    return (
      <div style={this.props.style} className="task-container">
        <div
          className={
            this.props.doneIsClicked ? 'task-isClicked task-text' : ' task-text'
          }
          onClick={this.props.onClick}
        >
          <h2> {this.props.name} </h2>
        </div>
        <div className="task-button">
        {this.props.userId === this.state.user.uid
          ? <button onClick={this._openModal} className="button-left">Share</button>
          : null
        }
          {/* <div className="modal-container"> */}
          
            <Modal
              isOpen={this.state.modalIsOpen}
              onAfterOpen={this._afterOpenModal}
              onRequestClose={this._closeModal}
              style={customStyles}
              contentLabel="Example Modal"
              >
              <div className="modal-left">
                <h2 ref={subtitle => (this.subtitle = subtitle)}>
                  Add collaborators
                </h2>
                <form onSubmit={this._handleSubmit} className="modal-form">
                  <input
                    type="text"
                    onChange={this._handleChange}
                    placeholder="email@calendar.com"
                    value={this.state.value}
                  />
                  {this._getUsersEmail().map(user => (
                    <p
                      key={user.uid}
                      onClick={() => this._handleClickOnEmail(user.email)}
                    >
                      {user.email}
                    </p>
                  ))}
                  <div className="form-button">
                    <button type='submit' >Add</button>
                    <button onClick={this._handleRemoveCollaborator} >Remove</button>
                  </div>
                </form>
              </div>
              <div className="modal-right">
                <h2>current collaborators</h2>
                {
                  this.props.collaborators.map((collaborator, index) => (
                  <p key={index} > {collaborator.email} </p>
                ))}
                <button onClick={this._closeModal}>close</button>
              </div>
            </Modal>
          {/* </div> */}
          <button onClick={this.props.onRemoveTodo} className="button-right">
            Delete
          </button>
        </div>
      </div>
    )
  }
}

export default Task
