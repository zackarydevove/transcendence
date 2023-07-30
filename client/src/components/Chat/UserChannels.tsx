import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface Group {
    username: string;
}

interface UserChannelsProps {
    search: string;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    groups: Group[];
}

const UserChannels: React.FC<UserChannelsProps> = ({ search, handleSearchChange, groups }) => {
  return (
    <div className='flex flex-col items-center justify-start overflow-y-auto p-8 pt-0'>
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

        {/* List of user's groups */}
        <div className='w-full overflow-y-auto'>
            {groups.map((friend, index) => (
                <div key={index} className='flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-200 hover:cursor-pointer'>
                    {/* Group name */}
                    <div className='flex items-center'>
                        <p className='text-gray-700'>{friend.username}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default UserChannels
