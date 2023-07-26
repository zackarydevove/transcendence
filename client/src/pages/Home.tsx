import React from 'react'
import { FaGamepad, FaUser, FaUsers, FaComments, FaCog, FaPowerOff, FaTrophy } from 'react-icons/fa';

function Home() {
  return (
        <div className='flex items-center justify-center h-screen w-screen bg-gray-900'>

            <div className='flex flex-col items-center justify-center gap-6 text-white text-lg'>
                {/* Play */}
                <a href="/play" className='flex flex-col items-center text-white hover:text-indigo-500'>
                    <FaGamepad className='h-12 w-12'/>
                    <p>Play</p>
                </a>

                {/* Profile */}
                <a href="/profile" className='flex flex-col items-center text-white hover:text-indigo-500'>
                    <FaUser className='h-12 w-12'/>
                    <p>Profile</p>
                </a>

                {/* Friends */}
                <a href="/friends" className='flex flex-col items-center text-white hover:text-indigo-500'>
                    <FaUsers className='h-12 w-12'/>
                    <p>Friends</p>
                </a>

                {/* Chat */}
                <a href="/chat" className='flex flex-col items-center text-white hover:text-indigo-500'>
                    <FaComments className='h-12 w-12'/>
                    <p>Chat</p>
                </a>

                {/* Leaderboard */}
                <a href="/leaderboard" className='flex flex-col items-center text-white hover:text-indigo-500'>
                    <FaTrophy className='h-12 w-12'/>
                    <p>Leaderboard</p>
                </a>

				{/* Logout */}
				<a href="/login" className='flex flex-col items-center text-white hover:text-indigo-500'>
					<FaPowerOff className='h-12 w-12'/>
					<p>Logout</p>
				</a>

            </div>
        
        </div>
  )
}

export default Home
