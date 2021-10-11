import logo from '../img/logo.png';
import 'antd/dist/antd.css';
import '../scss/main.scss';

function Homepage() {
  return (
    <div className="App homepage">
        <header className="App header">
            <img src={logo} className="App logo" alt="logo" />

            <h1>Chatpage</h1>

            {/* <CollectionsPage /> */}

        </header>
    </div>
  );
}


export default Homepage;