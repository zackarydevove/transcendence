import React, { useState } from 'react';
import { FaComment, FaBan, FaTrash, FaGamepad, FaSearch } from 'react-icons/fa';
import { BiSolidSend } from 'react-icons/bi';
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

        {/* Back Button */}
        <BackButton />

        <div className='flex items-center justify-center gap-3 h-3/4 w-3/4'>
            {/* Left : User's channels / Joinable channels */}
            <div className='flex flex-col gap-3 h-full w-1/4'>
            
                <div className='flex flex-col items-center justify-start h-full bg-white rounded-xl shadow-md overflow-y-auto p-8 '>


                        <div className='flex flex-col items-center justify-start overflow-y-auto '>
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


                            {/* Friends List */}
                            <div className='w-full h-full overflow-y-auto '>
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

            </div>


            {/* Right : Chat */}
            <div className='flex flex-col bg-white rounded-xl shadow-md p-8 h-full w-2/4'>

                {/* Chat messages */}
                <div className='flex flex-col h-full w-full overflow-y-auto mb-4'>
                    {/* Mock Messages - Do mapped messages here */}
                    <div className='self-start flex flex-row items-start bg-blue-200 rounded-xl p-2 mt-2'>
                        {/* Profile Picture */}
                        <div className='flex-shrink-0 h-10 w-10 bg-black rounded-full mr-3 hover:cursor-pointer'/> 
                        <div>
                            {/* Name and time */}
                            <p>Bob · 3:05 AM</p> 
                            {/* Message */}
                            <p>Hi, how are you zack hey sjajdksa kdsa lasld kwako sadjmklosa jdw sdnd sajnb dlwan jsn dkjasnwj sakbdkhaw! dsamk dsamlkdwanj dsanjlaw njkmlsdn bkawbsajl ndsajdwnanjskdsa sakd mskad jsadkjmsa?</p> 
                        </div>
                    </div>
                    <div className='self-end flex flex-row items-start bg-green-200 rounded-xl p-2 mt-2'>
                        {/* Profile Picture */}
                        <div className='flex-shrink-0 h-10 w-10 bg-black rounded-full mr-3 hover:cursor-pointer'/> 
                        <div>
                            {/* Name and time */}
                            <p>You · Now</p> 
                            {/* Message */}
                            <p>I'm good, how about you?</p>
                        </div>
                    </div>
                </div>

                {/* Send a message */}
                <div className='w-full flex items-center justify-start border-t-2 border-gray-200 pt-2'>
                    <input className='mr-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500' placeholder='Type a message' />
                    <BiSolidSend className='text-indigo-500' size='1.5em'/>
                </div>

            </div>

        </div>

    </div>
  )

}

export default Friends;