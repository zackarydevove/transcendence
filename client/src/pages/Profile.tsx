import React, { useState, ChangeEvent } from 'react';
import {FaLock, FaTrophy } from 'react-icons/fa';
import BackButton from '../components/BackButton';
import { BsCameraFill } from 'react-icons/bs';

interface Game {
  date: string;
  opponent: string;
  scoreA: number;
  scoreB: number;
  points: number;
}

const Profile: React.FC = () => {
  const [username, setUsername] = useState<string>('Zack');
  const [wins, setWins] = useState<number>(34);
  const [losses, setLosses] = useState<number>(12);
  const [rankPoints, setRankPoints] = useState<number>(128);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  // Mock data
  const games: Game[] = [
    { date: '01/01/2023', opponent: 'Bob', scoreA: 3, scoreB: 7, points: -16},
    { date: '01/01/2023', opponent: 'Zack', scoreA: 5, scoreB: 3, points: 14},
    { date: '01/01/2023', opponent: 'Tom', scoreA: 4, scoreB: 11, points: -15},
    { date: '01/01/2023', opponent: 'Zack', scoreA: 5, scoreB: 3, points: 15},
    { date: '01/01/2023', opponent: 'Tom', scoreA: 4, scoreB: 11, points: -14},
    { date: '01/01/2023', opponent: 'Zack', scoreA: 5, scoreB: 3, points: 15},
    { date: '01/01/2023', opponent: 'Tom', scoreA: 4, scoreB: 11, points: -14},
    { date: '01/01/2023', opponent: 'Zack', scoreA: 5, scoreB: 3, points: 15},
    { date: '01/01/2023', opponent: 'Tom', scoreA: 4, scoreB: 11, points: -16},
    { date: '01/01/2023', opponent: 'Zack', scoreA: 5, scoreB: 3, points: 14},
    { date: '01/01/2023', opponent: 'Tom', scoreA: 4, scoreB: 11, points: -15},
  ]; 

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  }

  const onHover = (x: boolean) => {
    setIsHovered(x);
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
                    <div className='relative flex items-center justify-evenly mb-4 w-full'>
                        <div className='flex justify-center items-center h-24 w-24 bg-pp bg-cover rounded-full border border-gray-200 hover:cursor-pointer'
                        onMouseEnter={() => onHover(true)}
                        onMouseLeave={() => onHover(false)}>
                            <BsCameraFill className={`${isHovered ? '' : 'hidden'}`} size={'2em'} />
                        </div>
                        <div className='ml-4'>
                            <div className='flex gap-1'>
                                <p>{wins} W</p>
                                <p>{losses} L</p>
                            </div>
                            <p>Winrate: {(wins / (wins + losses) * 100).toFixed(2)}%</p>
                            <p>{rankPoints} Points</p>
                        </div>
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
                                className={`relative flex items-center justify-evenly rounded-xl px-3 py-1 ${game.scoreA > game.scoreB ? 'bg-green-300' : 'bg-red-300'}`}>
                                <p className='text-xs'>{game.date}</p>
                                <p>{game.scoreA}</p>
                                <p className='text-gray-700 mb-1'>{game.opponent}</p>
                                <p>{game.scoreB}</p>
                                <p className='text-xs'>{game.points}</p>
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