import 'antd/dist/antd.css';
import '../../scss/main.scss';

function Chatpage (props) {
  // console.log('in chatpage, user_id: ', user_id);
  return (
    <div className="App homepage">
        <header className="App header">
          {/* <img src={logo} className="App logo" alt="logo" /> */}

          <h1>Chatpage {props.user_id}</h1>
        </header>
    </div>
  );
}


export default Chatpage;