import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class UserInput extends Component {
  static propTypes = {
    messageChange: PropTypes.func.isRequired,
    handleKeyDown: PropTypes.func.isRequired,
    newMessage: PropTypes.string.isRequired
  }

  render() {
    const { newMessage, messageChange, handleKeyDown} = this.props;
    return (
      <input className="new-message"
        value={newMessage}
        onChangeCapture={messageChange}
        // onChange={ () =>{console.log("onChange event"); }}
        onKeyDown={handleKeyDown} 
        // onKeyUp={() => { console.log("key up event"); }}
      />
    );
  }
}