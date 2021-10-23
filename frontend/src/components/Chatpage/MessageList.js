import React, { Component} from 'react';
import MessageItem from './MessageItem';
import PropTypes from 'prop-types';


export default class MessageList extends Component {
  static propTypes = {
    threads: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired
  }

  render() {
    // const { threads, index } = this.props;
    const threads = this.props.threads
    const index = this.props.index
    console.log(threads);
    console.log(index);
    console.log(threads[index]);
    console.log(threads[index].messages[0])
    const messages = threads[index].messages;
    return (
      <div>
        {messages.map((message, id) => {
          return (
            <MessageItem key={id}
                         fromMe={message.fromMe}
                         text={message.text} />
          );
        })}
      </div>
    );
  }
}