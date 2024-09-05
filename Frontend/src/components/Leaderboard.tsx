import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux';

const Leaderboard: React.FC = () => {
  const { username, wins } = useSelector((state: RootState) => state.user);

  return (
    <div>
      <h3>Leaderboard</h3>
      <p>{username}: {wins} wins</p>
    </div>
  );
};

export default Leaderboard;
