import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TaskPage from './pages/TaskPage';
import SplashPage from './pages/SplashPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/tasks" component={TaskPage} />
        <Route path="/" component={SplashPage} />
      </Switch>
    </Router>
  );
}

export default App;