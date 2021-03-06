import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class MessageItem extends Component {
  static propTypes = {
    fromMe: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
  }

  render() {
    const { fromMe, text} = this.props;
    return (
      <div className={`message-item ${fromMe ? 'message-from-me' : 'message-from-other'}`}>
        <span>{text}</span>
      </div>
    );
  }
}