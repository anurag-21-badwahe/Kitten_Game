import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUsername } from '../redux/userSlice';

const Login: React.FC = () => {
  const [username, setUsernameInput] = useState('');
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (username) {
      dispatch(setUsername(username));
    }
  };

  return (
    <div>
      <h2>Enter Username</h2>
      <input value={username} onChange={(e) => setUsernameInput(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
