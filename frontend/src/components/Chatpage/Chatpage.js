import logo from '../../img/logo.png';
import 'antd/dist/antd.css';
import '../../scss/main.scss';

function Chatpage (props) {
  // console.log('in chatpage, user_id: ', user_id);
  return (
    <div className="App homepage">
        <header className="App header">
          <h1>Chatpage {props.user_id}</h1>
          <div className="Chat mainroom">
            <div className="Chat dialogue">
              <div className="Chat chatbox">

              </div>
              <input className="Chat inputbox" type="text" id="usrtxt" name="usrtxt" placeholder="請輸入您的疑問..."></input>

            </div>
            <div className="Chat inform">
              <img src={logo} className="Chat logo" alt="logo" />
              <div className="Chat infoFunction">
                <img src={logo} className="Chat logo hotel" alt="hotel"></img>
                <img src={logo} className="Chat logo restaurant" alt="restaurant"></img>
                <img src={logo} className="Chat logo taxi" alt="taxi"></img>
                <img src={logo} className="Chat logo attraction" alt="attraction"></img>
              </div>
            </div>
          </div>
        </header>
    </div>
  );
}


export default Chatpage;