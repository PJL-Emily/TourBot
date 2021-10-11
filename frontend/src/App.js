import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './scss/main.scss';
import Homepage from './components/Homepage/Homepage';
import Chatpage from './components/Chatpage/Chatpage';

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/chatroom/" component={Chatpage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
