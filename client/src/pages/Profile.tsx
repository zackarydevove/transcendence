import React, { useState, ChangeEvent } from 'react';
import {FaLock, FaTrophy } from 'react-icons/fa';
import BackButton from '../components/BackButton';

interface Game {
  opponent: string;
  scoreA: number;
  scoreB: number;
}

const Profile: React.FC = () => {
  const [username, setUsername] = useState<string>('Zack');
  const games: Game[] = [
    { opponent: 'Bob', scoreA: 3, scoreB: 7},
    { opponent: 'Zack', scoreA: 5, scoreB: 3},
    { opponent: 'Tom', scoreA: 4, scoreB: 11},
    { opponent: 'Zack', scoreA: 5, scoreB: 3},
    { opponent: 'Tom', scoreA: 4, scoreB: 11},
    { opponent: 'Zack', scoreA: 5, scoreB: 3},
    { opponent: 'Tom', scoreA: 4, scoreB: 11},
    { opponent: 'Zack', scoreA: 5, scoreB: 3},
    { opponent: 'Tom', scoreA: 4, scoreB: 11},
    { opponent: 'Zack', scoreA: 5, scoreB: 3},
    { opponent: 'Tom', scoreA: 4, scoreB: 11},
  ]; // Mock data

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  }

  return (
    <div className='relative flex items-center justify-center h-screen w-screen bg-gray-900'>
      
        {/* Back Button */}
        <BackButton />

        <div className='flex gap-3 w-1/2'>
            {/* Left */}
            <div className='flex flex-col gap-3'>
                {/* up */}
                <div className='flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-8'>

                    {/* Profile Picture */}
                    <div className='relative mb-4'>
                        <div className='h-24 w-24 bg-black rounded-full'/>

                    </div>
                    
                    {/* Username */}
                    <div className='mb-4 w-full'>
                    <p className='text-gray-500 mb-2'>Username</p>
                    <input 
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
                        type='text'
                        value={username}
                        onChange={handleUsernameChange}
                    />
                    </div>

                </div>
                {/* down */}
                <div className='flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-8'>

                    {/* 2FA */}
                    <button className='w-full py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75'>
                    <FaLock className='inline-block mr-2' size={20}/>Set 2FA with Google Authenticator
                    </button>

                </div>

            </div>

            {/* Right */}
            <div className='flex flex-col  bg-white rounded-xl shadow-md p-8 w-1/2'>

                {/* History */}
                <div className='w-full'>
                    <div className='flex gap-3'>
                        <FaTrophy className='text-indigo-500 mb-2' size={24}/>
                        <p className='text-gray-500 mb-2'>History</p>
                    </div>
                    <div className='flex flex-col gap-3 overflow-y-auto max-h-64'>
                        {games.map((game, index) => (
                            <div key={index}
                                className={`relative flex justify-evenly rounded-xl px-3 py-1 ${game.scoreA > game.scoreB ? 'bg-green-300' : 'bg-red-300'}`}>
                                <p>{game.scoreA}</p>
                                <p className='text-gray-700 mb-1'>{game.opponent}</p>
                                <p>{game.scoreB}</p>
                                {/* <p className='absolute bottom-0.5 left-2 text-xs'>12.07.23</p> */}
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>

    </div>
  )
}

export default Profile;