import React, { Component } from 'react'
import Modal from 'react-modal';
import { app } from '../../../../base'


import './styles.css'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    display               :'flex'
  }
}



Modal.setAppElement('#root')

class Task extends Component {
  constructor(props) {
    super(props);
    
    this.ref = app.database().ref('baby-calendar')
    this.usersRef = this.ref.child('users')

    this.state = {
      value: '',
      collaborators: this.props.collaborators,
      modalIsOpen: false,
      users: []
    };
  }


 componentWillMount = ()=>{
  const newUsers = []
  this.usersRef.on('child_added', snap =>{
    newUsers.push(snap.val())
  })
  this.setState({
    modalIsOpen: true,
    users: newUsers
  })
 }
 componentDidMount = () => {
  const collaborators = this.state.collaborators
  console.log('collaborators 1: ',collaborators);


  // console.log('users: ', this.state.users);
  // if(collaborators){
  //   this.setState({ collaborators :
  //     collaborators.map(collaborator => 
  //       this.state.users.forEach(user => {
  //         console.log('collaborator:  ', collaborator)
  //         console.log('collab.key: ', Object.keys(collaborator))
  //         console.log('user.id: ',user.uid);
  //         // const allo = Object.keys(collaborator)
  //         // console.log('allo : ', allo[0]);
  //         if ( Object.keys(collaborator)[0] === user.uid) {
  //             console.log('samekey :',{...collaborator, email: user.email});
  //           return {...collaborator, email: user.email}
  //         }        
  //       })
  //     )
  //   })
  // }
 }


  
  openModal=() => {
    
  }

  afterOpenModal=()=> {
    // references are now sync'd and can be accessed.
    // this.subtitle.style.color = '#f00';
  }

  closeModal=()=> {
    this.setState({modalIsOpen: false});
  }

  getGoodEmail=()=>{
    return this.state.users.filter(user => 
      user.email.includes(this.state.value)
    )
  }
  
  handleChange= event =>{
    this.setState({ value: event.target.value })
  }

  handleRemoveTodo = () => {
    this.props.onRemoveTodo()
  }
  handleShareTodo = () => {
    this.props.shareTodo()
  }

  render() {
  // console.log('collaborators: ',this.state.collaborators);
    return (
      <div style={this.props.style}  className="task-container">
        <div 
        className={
          this.props.doneIsClicked
            ? 'task-isClicked task-text'
            : ' task-text'
        }
        onClick={this.props.onClick} >
          <h2> {this.props.name} </h2>
        </div>
        <div className="task-button">
          <button onClick={this.openModal} className="button-left" >Share</button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <div className="modal-left">

              <h2 ref={subtitle => this.subtitle = subtitle}>Add collaborators</h2>
              <form onSubmit={this.handleSubmit} className="modal-form" >

                <input type="text" onChange={this.handleChange} placeholder="enter email@" />
                <button onClick={this.handleAddOnCollab} >Add</button>
              </form>
              {
                this.getGoodEmail().map(user => 
                <p key={user.uid} >{user.email}</p>
              )}
            </div>
            <div className="modal-right" >
              <h3>present collaborators</h3>
              {/* {this.state.collaborators.map(collaborator=> 
                <p key={collaborator.key} >{collaborator.email}</p>
              )} */}
              <button onClick={this.closeModal}>close</button>
            </div>
          </Modal>
          <button onClick={this.handleUnshareTodo} className="button-middle" >Unshare</button>
          <button onClick={this.handleRemoveTodo} className="button-right" >Delete</button>
        </div>
      </div>
    )
  }
}

export default Task
