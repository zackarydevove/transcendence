import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import BackButton from '../components/BackButton';

interface Player {
  username: string;
  points: number;
  matchesWon: number;
  matchesLost: number;
}

const Leaderboard: React.FC = () => {
  const [search, setSearch] = useState<string>('');

  // Mock data
  const players: Player[] = [
    { username: 'Player 1', points: 2000, matchesWon: 100, matchesLost: 50 },
    { username: 'Player 2', points: 1800, matchesWon: 90, matchesLost: 60 },
    { username: 'Player 3', points: 1600, matchesWon: 80, matchesLost: 70 },
    { username: 'Player 4', points: 2000, matchesWon: 100, matchesLost: 50 },
    { username: 'Player 5', points: 1800, matchesWon: 90, matchesLost: 60 },
    { username: 'Player 6', points: 1600, matchesWon: 80, matchesLost: 70 },
    { username: 'Player 7', points: 2000, matchesWon: 100, matchesLost: 50 },
    { username: 'Player 8', points: 1800, matchesWon: 90, matchesLost: 60 },
    { username: 'Player 9', points: 1600, matchesWon: 80, matchesLost: 70 },
    { username: 'Player 10', points: 2000, matchesWon: 100, matchesLost: 50 },
    { username: 'Player 11', points: 1800, matchesWon: 90, matchesLost: 60 },
    { username: 'Player 12', points: 1600, matchesWon: 80, matchesLost: 70 },
    // More players...
  ];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

  return (
    <div className='relative flex flex-col items-center justify-center h-screen w-screen bg-gray-900'>

      {/* Back Button */}
      <BackButton />

      <div className='flex flex-col items-center justify-center gap-3 h-3/4 w-3/4 bg-white rounded-xl shadow-md p-8'>

        <h1 className='text-2xl font-bold mb-8'>Leaderboard</h1>

        {/* SearchBar */}
        <div className='flex items-center mb-4 w-full'>
          <input
            className='w-full px-3 py-2 border border-gray-300 rounded-md mr-2 focus:outline-none focus:border-indigo-500'
            type='text'
            placeholder='Search'
            value={search}
            onChange={handleSearchChange}
          />
          <FaSearch className='text-gray-500 max-sm:hidden' size='1.7em' />
        </div>

        {/* Players List */}
        <div className='w-full h-full overflow-y-auto '>
          {players.filter(player => player.username.toLowerCase().includes(search.toLowerCase())).map((player, index) => (
            <div key={index} className='flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-100'>
              {/* PP && Username */}
              <div className='flex gap-4 items-center'>
                <div className='w-12 h-12 bg-pp bg-cover rounded-full'/>
                <p className='text-gray-700'>{player.username}</p>
              </div>
              {/* Points */}
              <p className='text-gray-700'>{player.points} points</p>
              {/* Matches Won */}
              <p className='text-green-700'>{player.matchesWon} wins</p>
              {/* Matches Lost */}
              <p className='text-red-700'>{player.matchesLost} losses</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;