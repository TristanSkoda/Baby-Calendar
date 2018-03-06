import React, { Component } from 'react'

import './styles.css'

class BottomBar extends Component {
  render() {
    const { option, onClickClearAllDone } = this.props
    return (
      <div className="bottombar-container">
        <button
          className={option === 'All' ? 'selected' : ''}
          onClick={() => this.props.onClick('All')}
        >
          All
        </button>
        <button
          className={option === 'Active' ? 'selected' : ''}
          onClick={() => this.props.onClick('Active')}
        >
          Active
        </button>
        <button
          className={option === 'Done' ? 'selected' : ''}
          onClick={() => this.props.onClick('Done')}
        >
          Done
        </button>
        <button className="clearall" onClick={onClickClearAllDone}>
          Delete all Done
        </button>
      </div>
    )
  }
}

export default BottomBar
