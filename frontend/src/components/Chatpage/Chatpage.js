import logo from '../../img/logo.png';
import 'antd/dist/antd.css';
import '../../scss/main.scss';
import React, { useState } from 'react';
import MessageList from './MessageList';
import UserInput from './UserInput';
import { useIdleTimer } from 'react-idle-timer';
import { Link, useHistory } from 'react-router-dom';
import ViewState from './ViewState';
import ViewItem from './Swiper';
import AuthService from "../../services/auth.service";

function Chatpage () {
  const history = useHistory();
  function navigateToHome () {
    history.push("/");
  };
  function refreshPage () {
    let msg = "您確定要重新開始聊天嗎？\n所有聊天記錄將被清空，但仍可保留您的個人資訊";
    if (window.confirm(msg)) {
      AuthService.restart()
      .then(() => {
        window.location.reload(false);
      })
      .catch((err) => {
          console.log(err);
      }); 
    }
  }
  function exitPage (event) {
    let msg = "您確定要離開聊天室嗎？\n所有聊天記錄將被清空，您將需要重新填寫個人資訊";
    if (window.confirm(msg)) {
      AuthService.exit()
      .catch((err) => {
        console.log(err);
      });
    }
    else {
      event.preventDefault();
    }
  }

  const handleOnIdle = () => {
    console.log('user is idle');
    window.alert('您已閒置過久，將自動導入首頁重新進入聊天');
    // TODO: how to force close modal?
    // in restart/exit confirm window, idle timer does not work
    console.log('last active', getLastActiveTime());
    AuthService.exit()
    .catch((err) => {
      console.log(err);
    });
    navigateToHome();
  }
  const handleOnActive = () => {
    console.log('user is active');
    console.log('time remaining', getRemainingTime());
  };
  const handleOnAction = () => {
    console.log('user did something');
  };
  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * 30 * 1, // idle time: 30 min
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500
  });

  function handleMessageChange(event) {
    setState({ currentIndex: event});
  }
  function handleKeyDown(event) {
    const message = event.target.value;
    const time = new Date().toDateString();
    const addMessage = {fromMe: true, text: message, time: time};

    if (event.keyCode === 13 && message !== '') {
      const {threads, currentIndex} = initialState;
      threads[currentIndex].messages.push(addMessage);

      setState({
        newMessage: '',
        threads: threads
      });
    }
  }

  // Handle Input
  const [initialState, setState] = React.useState({
    newMessage:'',
    threads: [
      {
        target:{
          name:'System',
        },
        messages: [
          {fromMe: false, text:'請問有什麼能為您服務的呢？', time:'00:00'}
        ]
      }
    ],
    currentIndex: 0
  })



  return (

    <div className="App chatpage">
        <div className="Chat header">
          {/* <h1>Chatpage {props.user_id}</h1> */}
          <div className="Chat mainroom">
            <div className="Chat dialogue">
              <div className="Chat chatbox">
                <div className="message-list">
                  <MessageList threads={initialState.threads} index={initialState.currentIndex} />
                </div>
              </div>
              {/* <div className="Chat inputForm">
                <UserInput
                  newMessage={initialState.newMessage}
                  messageChange={handleMessageChange}
                  handleKeyDown={handleKeyDown}
                />
              </div> */}
              <div className="Chat inputForm">
                <input className="Chat inputbox" type="text" id="usrtxt" name="usrtxt" placeholder="請輸入您的疑問..." value={initialState.newMessage} onChange={handleMessageChange} onKeyDown={handleKeyDown}></input>
                <button className="Chat sendbtn" type="submit" id="usrsend" name="usrsend">傳送</button>
              </div>
            </div>
            <div className="Chat inform">
              <img src={logo} className="Chat logo" alt="logo" />
              <h2>TourBot</h2>
              <h3>很高興為您服務！</h3>
              <div className="Chat infoFunction">
                <ViewState />
                <ViewItem type="酒店" />
                <ViewItem type="景點" />
                <ViewItem type="餐廳" />
              </div>
              <div className="Chat infoExit">
                <div className="Chat restart">
                  <a onClick={refreshPage}>
                    <span className="material-icons Chat btn">
                      restart_alt
                    </span>             
                    <p>重新開始</p>
                  </a>
                </div>
                <div className="Chat leave">
                  <Link to="/" onClick={exitPage}>
                    <span className="material-icons Chat btn">
                      logout
                    </span>            
                    <p>離開</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}


export default Chatpage;