import logo from '../img/logo.png';
import '../scss/main.scss';
import 'antd/dist/antd.css';
import CollectionsPage from '../Modal/ModalForm';

function Homepage() {
  return (
    <div className="App homepage">
        <header className="App header">
            <img src={logo} className="App logo" alt="logo" />

            <h1>TourBot</h1>

            <CollectionsPage />

            {/* <button className="App chatBtn" href="../Chatpage/Chatpage.js">
                開始聊天
            </button> */}
        </header>
    </div>
  );
}


export default Homepage;