import logo from '../../img/logo.png';
import 'antd/dist/antd.css';
import '../../scss/main.scss';
// import MaterialIcon, {colorPalette} from 'material-icons-react';
import { Link, Redirect } from 'react-router-dom';
import AuthService from "../../services/auth.service";
import React, { useState } from 'react';
import MessageList from './MessageList';
import UserInput from './UserInput';

function Chatpage (props) {
  // console.log('in chatpage, user_id: ', user_id);

  // TRY Restart
  function restartPage() {
    const onRestart = (values) => {
      AuthService.restart()
    }

    window.location.reload(false);
  }
  
  // Try Exit

  // Handle Input
  const [state = useState(0);]

  return (

    <div className="App chatpage">
        <div className="Chat header">
          {/* <h1>Chatpage {props.user_id}</h1> */}
          <div className="Chat mainroom">
            <div className="Chat dialogue">
              <div className="Chat chatbox">
                {/* <MessageList threads={threads} index={currentIndex} /> */}
              </div>
              <form className="Chat inputForm">
                <input className="Chat inputbox" type="text" id="usrtxt" name="usrtxt" placeholder="請輸入您的疑問..."></input>
                <button className="Chat sendbtn" type="submit" id="usrsend" name="usrsend">傳送</button>
              </form>
            </div>
            <div className="Chat inform">
              <img src={logo} className="Chat logo" alt="logo" />
              <h2>TourBot</h2>
              <h3>很高興為您服務！</h3>
              <div className="Chat infoFunction">
                <a href="#" className="info-btn preview-btn">
                  <span className="material-icons Chat btn">
                    preview
                  </span>
                  <span>
                    檢視
                  </span>
                </a>
                <a href="#" className="info-btn bed-btn">
                  <span className="material-icons Chat btn">
                    bed
                  </span>
                  <span>
                    酒店
                  </span>
                </a>
                <a href="#" className="info-btn museum-btn">
                  <span className="material-icons Chat btn">
                    museum
                  </span>
                  <span>
                    景點
                  </span>                
                </a>
                <a href="#" className="info-btn restaurant-btn">
                  <span className="material-icons Chat btn">
                    restaurant_menu
                  </span>
                  <span>
                    餐廳
                  </span>              
                </a>
              </div>
              <div className="Chat infoExit">
                <div className="Chat restart">
                  <a onClick={restartPage}>
                    <span className="material-icons Chat btn">
                      restart_alt
                    </span>             
                    <p>重新開始</p>
                  </a>
                </div>
                <div className="Chat leave">
                  <Link to="/">
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