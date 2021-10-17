import { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './scss/main.scss';
import Homepage from './components/Homepage/Homepage';
import Chatpage from './components/Chatpage/Chatpage';

function App() {
  const [user_id, setUserID] = useState('test_id');

  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/">
            <Homepage setUserID={setUserID} />
          </Route>
          <Route exact path="/chatroom/">
            <Chatpage user_id={user_id} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
