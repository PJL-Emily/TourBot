import logo from '../../img/logo.png';
import 'antd/dist/antd.css';
import '../../scss/main.scss';
import React, { useState } from 'react';
import MessageList from './MessageList';
import { useIdleTimer } from 'react-idle-timer';
import { Link, useHistory } from 'react-router-dom';
import ViewState from './State/ViewState';
import ViewItem from './Swiper/Swiper';
import Service from "../../services/service";


function Chatpage () {
  // use incremental approach
  const [hotel, setHotel] = useState(0);
  const [rest, setRest] = useState(0);
  const [site, setSite] = useState(0);

  const history = useHistory();
  const navigateToHome = () => {
    history.push("/");
  };
  const restartPage = () => {
    let msg = "您確定要重新開始聊天嗎？\n所有聊天記錄將被清空，但仍可保留您的個人資訊";
    if (window.confirm(msg)) {
      Service.restart()
      .then(() => {
        window.location.reload(false);
      })
      .catch((err) => {
          console.log(err);
      }); 
      // window.location.reload(false);
    }
  }

  const exitPage = (event) => {
    let msg = "您確定要離開聊天室嗎？\n所有聊天記錄將被清空，您將需要重新填寫個人資訊";
    if (!window.confirm(msg)) {
      event.preventDefault();
    }
    else {
      console.clear();
    }
  }

  const handleOnIdle = () => {
    console.log('user is idle');
    window.alert('您已閒置過久，將自動導入首頁重新進入聊天');
    console.log('last active', getLastActiveTime());
    navigateToHome();
    // reset state?
  }

  const handleOnActive = () => {
    console.log('user is active');
    console.log('time remaining', getRemainingTime());
  };

  const handleOnAction = () => {
    // console.log('user did something');
  };
  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * 30 * 1, // idle time: 30 min
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500
  });

  const handleMessageChange = (event) => {
    // console.log("Message Change Event: ",event);
    setNewMessage(event.target.value);
    // console.log("Set State after message change =>", newMessage);
  }
  const handleKeyDown = (event) => {
    const message = event.target.value;
    // console.log("Key Down Message: ",message);
    // console.log("Key Down Event: ",event);
    const time = new Date().toDateString();
    // console.log("Key Down Time: ",time);
    const addMessage = {fromMe: true, text: message, time: time};
    // console.log("Key Down AddMessage: ",addMessage);

    if (event.keyCode === 13 && message !== '') {
      Service.sendUserUtter(newMessage)
      .then(data => {
        console.log('Send user utterance: ', newMessage);
        console.log('Response data: ', data)
        
        setThreads((threads) =>
        [...threads, addMessage]
        );
        setNewMessage('');

        // response
        const reMessage = {fromMe: false, text: "我是機器人", time: time};
        setThreads((threads) =>
        [...threads, reMessage]
        );
      })
      .catch(error => {
        const resMessage =
          (error.response && error.response.data 
            && error.response.data.message) || 
            error.message || error.toString();

            console.log('sendUserUtter error: ', resMessage);
            //TEST
            alert('測試階段：sendUserUtter 失敗同樣傳進聊天室');
            setThreads((threads) =>
            [...threads, addMessage]
            );
            setNewMessage('');
            const reMessage = {fromMe: false, text: "我是機器人", time: time};
            setThreads((threads) =>
            [...threads, reMessage]
            );
            //
      })

      // setThreads((threads) =>
      // [...threads, addMessage]
      // );
      // setNewMessage('');
    }
  }
  const handleSendMessage = (event) => {
    const time = new Date().toDateString();
    const addMessage = {fromMe: true, text: newMessage, time: time};
    // console.log("Send Button AddMessage: ",addMessage);

    if (newMessage !== '') {
      // HERE
      Service.sendUserUtter(newMessage)
      .then(data => {
        console.log('Send user utterance: ', newMessage);
        console.log('Response data: ', data)
        
        setThreads((threads) =>
        [...threads, addMessage]
        );
        setNewMessage('');
        
        // response
        const reMessage = {fromMe: false, text: "我是機器人", time: time};
        setThreads((threads) =>
        [...threads, reMessage]
        );
      })
      .catch(error => {
        const resMessage =
          (error.response && error.response.data 
            && error.response.data.message) || 
            error.message || error.toString();

            console.log('sendUserUtter error: ', resMessage);
            //TEST
            alert('測試階段：sendUserUtter 失敗同樣傳進聊天室');
            setThreads((threads) =>
            [...threads, addMessage]
            );
            setNewMessage('');
            const reMessage = {fromMe: false, text: "我是機器人", time: time};
            setThreads((threads) =>
            [...threads, reMessage]
            );
            //
      })

      // setThreads((threads) =>
      // [...threads, addMessage]
      // );
      // setNewMessage('');
    }
  }

  // Handle Input
  const [newMessage, setNewMessage] = useState('')
  const [threads, setThreads] = useState(
    [
      {fromMe: false, text:'請問有什麼能為您服務的呢？', time:'00:00'}
    ]
  )

  return (

    <div className="App chatpage">
        <div className="Chat header">
          <div className="Chat mainroom">
            <div className="Chat dialogue">
              <div className="Chat chatbox">
                <div className="message-list">
                  <MessageList threads={threads}/>
                </div>
              </div>
              <div className="Chat inputForm">
                <input className="Chat inputbox" type="text" id="usrtxt" name="usrtxt" placeholder="請輸入您的疑問..." value={newMessage} onChange={handleMessageChange} onKeyDown={handleKeyDown}></input>
                <button className="Chat sendbtn" id="usrsend" name="usrsend" onChange={handleMessageChange} onClick={handleSendMessage}>傳送</button>
              </div>
            </div>
            <div className="Chat inform">
              <img src={logo} className="Chat logo" alt="logo" />
              <h2>TourBot</h2>
              <h3>很高興為您服務！</h3>
              <div className="Chat infoFunction">
                <ViewState />
                <ViewItem 
                  type="酒店" 
                  effect={hotel}
                />
                <ViewItem 
                  type="景點" 
                  effect={site}
                />
                <ViewItem 
                  type="餐廳"
                  effect={rest}
                />
              </div>
              <div className="Chat infoExit">



                <div className="Chat restart">
                  <a onClick={() => {
                    setHotel((hotel) => hotel + 1);
                    console.log(hotel);
                  }}>
                    <span className="material-icons Chat btn">
                      restart_alt
                    </span>          
                    <p>test setHotel</p>
                  </a>
                </div>


                
                <div className="Chat restart">
                  <a onClick={restartPage}>
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