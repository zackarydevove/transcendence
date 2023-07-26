import React, { useState } from 'react';
import { FaComment, FaBan, FaTrash, FaGamepad, FaSearch } from 'react-icons/fa';
import BackButton from '../components/BackButton';

interface Friend {
  username: string;
  profilePicture: string; // url to profile picture
}

const Friends: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const friends: Friend[] = [
    { username: 'Friend 1', profilePicture: '' }, // Mock data
    { username: 'Friend 2', profilePicture: '' },
    { username: 'Friend 3', profilePicture: '' },
    { username: 'Friend 4', profilePicture: '' },
    { username: 'Friend 5', profilePicture: '' },
    { username: 'Friend 6', profilePicture: '' },
    { username: 'Friend 7', profilePicture: '' },
    { username: 'Friend 8', profilePicture: '' },
    { username: 'Friend 9', profilePicture: '' },
    { username: 'Friend 10', profilePicture: '' },
  ];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

  return (
    <div className='relative flex items-center justify-center h-screen w-screen bg-gray-900'>

        <BackButton />

      <div className='flex flex-col items-center bg-white rounded-xl shadow-md p-4 md:p-8 md:w-1/2 lg:w-1/3 xl:w-1/4'>
        {/* Search Bar */}
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
        {/* Friends List */}
        <div className='w-full h-96 overflow-y-auto'>
          {friends.map((friend, index) => (
            <div key={index} className='flex items-center justify-between p-4 border-b border-gray-200'>
              {/* Profile Picture and Username */}
              <div className='flex items-center'>
                <div className='h-12 w-12 bg-gray-200 rounded-full mr-4' />
                <p className='text-gray-700'>{friend.username}</p>
              </div>
              {/* Actions */}
              <div className='flex items-center gap-4 max-sm:hidden'>
                <FaComment className='text-blue-500 cursor-pointer' />
                <FaGamepad className='text-green-500 cursor-pointer' />
                <FaBan className='text-red-500 cursor-pointer' />
                <FaTrash className='text-gray-500 cursor-pointer' />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Friends;