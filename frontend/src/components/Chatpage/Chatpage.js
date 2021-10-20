import logo from '../../img/logo.png';
import 'antd/dist/antd.css';
import '../../scss/main.scss';
import { Link, Redirect } from 'react-router-dom';
import ViewState from './ViewState';
import ViewItem from './Swiper';

function Chatpage (props) {
  // TRY Refresh
  function refreshPage() {
    window.location.reload(false);
  }
  // TRY Exit
  function exitPage() {
    // console.log('in chatpage');
    return (
      <Redirect to=".." />
    );
  }

  return (

    <div className="App chatpage">
        <div className="Chat header">
          {/* <h1>Chatpage {props.user_id}</h1> */}
          <div className="Chat mainroom">
            <div className="Chat dialogue">
              <div className="Chat chatbox">
              </div>
              <input className="Chat inputbox" type="text" id="usrtxt" name="usrtxt" placeholder="請輸入您的疑問..."></input>
              <input className="Chat sendbtn" type="submit" id="usrsend" name="usrsend" value="傳送"></input>
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