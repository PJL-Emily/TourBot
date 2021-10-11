import logo from '../../img/logo.png';
import 'antd/dist/antd.css';
import '../../scss/main.scss';
import CollectionsPage from '../Modal/ModalForm';

function Homepage() {
  return (
    <div className="App homepage">
        <header className="App header">
            <img src={logo} className="App logo" alt="logo" />

            <h1>TourBot</h1>

            <CollectionsPage />
        </header>
    </div>
  );
}

export default Homepage;