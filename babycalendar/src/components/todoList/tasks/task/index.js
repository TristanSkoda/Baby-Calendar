import React, { Component } from 'react'
import Modal from 'react-modal'
import { app } from '../../../../base'

import './styles.css'

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
    const newUsers = []
    this.usersRef.on('child_added', snap => {
      newUsers.push(snap.val())
    })
    this.setState({
      users: newUsers
    })
  }

  openModal = () => {
    this.setState({
      modalIsOpen: true,
    })
  }

  // afterOpenModal = () => {
  //   // references are now sync'd and can be accessed.
  //   // this.subtitle.style.color = '#f00';
  // }

  closeModal = () => {
    this.setState({ modalIsOpen: false })
  }

  getGoodEmail = () =>
    this.state.value !== ''
      ? this.state.users.filter(user => user.email.includes(this.state.value))
      : []

  handleChange = event => {
    this.setState({ value: event.target.value })
  }

  handleRemoveTodo = () => {
    this.props.onRemoveTodo()
  }
  handleShareTodo = () => {
    this.props.shareTodo()
  }
  handleClickOnEmail = data => {
    this.setState({
      value: data
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    this.state.users.forEach(user => {
      user.email === this.state.value
        ? // add le uid du user dans la bd dans les collaborateurs de la todo
          this.props.addACollaborator(user.uid)
        : null
    })
  }

 
  render() {
    // console.log('props collabor: ',this.props.collaborators);
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
        ? 
          <div>
            <button onClick={this.openModal} className="button-left">
              Share
            </button>
            <Modal
              isOpen={this.state.modalIsOpen}
              onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeModal}
              style={customStyles}
              contentLabel="Example Modal"
              >
              <div className="modal-left">
                <h2 ref={subtitle => (this.subtitle = subtitle)}>
                  Add collaborators
                </h2>
                <form onSubmit={this.handleSubmit} className="modal-form">
                  <input
                    type="text"
                    onChange={this.handleChange}
                    placeholder="enter email@"
                    value={this.state.value}
                  />
                  <button>Add</button>
                </form>
                {this.getGoodEmail().map(user => (
                  <p
                    key={user.uid}
                    onClick={() => this.handleClickOnEmail(user.email)}
                  >
                    {user.email}
                  </p>
                ))}
              </div>
              <div className="modal-right">
                <h3>present collaborators</h3>
                {
                  this.props.collaborators.map(collaborator => (
                  <p key={collaborator} > {collaborator.email} </p>
                ))}
                <button onClick={this.closeModal}>close</button>
              </div>
            </Modal>
            <button onClick={this.handleUnshareTodo} className="button-middle">
              Unshare
            </button>
          </div>
          : null
        }
          <button onClick={this.handleRemoveTodo} className="button-right">
            Delete
          </button>
        </div>
      </div>
    )
  }
}

export default Task
