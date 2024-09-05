import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux';
import Game from './components/Game';
import Login from './components/Login';
import Leaderboard from './components/Leaderboard';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <Login />
        <Game />
        <Leaderboard />
      </div>
    </Provider>
  );
};

export default App;
