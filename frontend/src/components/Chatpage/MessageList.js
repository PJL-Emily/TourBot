import React, { Component} from 'react';
import MessageItem from './MessageItem';
import PropTypes from 'prop-types';


export default class MessageList extends Component {
  static propTypes = {
    threads: PropTypes.array.isRequired
  }

  render() {
    const { threads} = this.props;
    // const threads = this.props.threads
    // const index = this.props.index
    console.log("Threads in Message List: ", threads);
    // console.log("threads[0]: ", threads[0]);
    // const messages = threads.messages;
    return (
      <div>
        {threads.map((message, id) => {
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