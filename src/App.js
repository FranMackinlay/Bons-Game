import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Login from './components/login/login';
import GameBoard from './components/game-board/gameBoard';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/gameBoard" component={GameBoard} />
        <Route to="/Login" component={Login} />
      </Switch>
    </Router>
  );
}

export default App;
