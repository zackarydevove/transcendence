import React from 'react';
import { FaTrophy } from 'react-icons/fa';

interface Game {
    date: string;
    opponent: string;
    scoreA: number;
    scoreB: number;
    points: number;
}

const Historic: React.FC = () => {

  // Mock data
  const games: Game[] = [
    { date: '01/01/2023', opponent: 'Bob', scoreA: 3, scoreB: 7, points: -16},
    { date: '01/01/2023', opponent: 'Pop', scoreA: 5, scoreB: 3, points: 14},
    { date: '01/01/2023', opponent: 'Tom', scoreA: 4, scoreB: 11, points: -15},
    { date: '01/01/2023', opponent: 'Pop', scoreA: 5, scoreB: 3, points: 15},
    { date: '01/01/2023', opponent: 'Tom', scoreA: 4, scoreB: 11, points: -14},
    { date: '01/01/2023', opponent: 'Pop', scoreA: 5, scoreB: 3, points: 15},
    { date: '01/01/2023', opponent: 'Tom', scoreA: 4, scoreB: 11, points: -14},
    { date: '01/01/2023', opponent: 'Pop', scoreA: 5, scoreB: 3, points: 15},
    { date: '01/01/2023', opponent: 'Tom', scoreA: 4, scoreB: 11, points: -16},
    { date: '01/01/2023', opponent: 'Pop', scoreA: 5, scoreB: 3, points: 14},
    { date: '01/01/2023', opponent: 'Tom', scoreA: 4, scoreB: 11, points: -15},
  ]; 

    return (
        <div className='flex flex-col  bg-white rounded-xl shadow-md p-8 w-1/2 max-lg:w-full'>
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
    );
}

export default Historic;
