import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { BiSolidSend } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import BackButton from '../components/BackButton';

interface Friend {
  username: string;
  status: string;
  profilePicture: string; // url to profile picture
}

const Friends: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [friendList, setFriendList] = useState<boolean>(true);

  // Mock data
  const friends: Friend[] = [
    { username: 'Friend 1', status: 'online', profilePicture: '' }, 
    { username: 'Friend 2', status: 'online', profilePicture: '' },
    { username: 'Friend 3', status: 'offline', profilePicture: '' },
    { username: 'Friend 4', status: 'in game', profilePicture: '' },
    { username: 'Friend 5', status: 'online', profilePicture: '' },
    { username: 'Friend 6', status: 'offline', profilePicture: '' },
    { username: 'Friend 7', status: 'offline', profilePicture: '' },
    { username: 'Friend 8', status: 'in game', profilePicture: '' },
    { username: 'Friend 9', status: 'online', profilePicture: '' },
    { username: 'Friend 10', status: 'online', profilePicture: '' },
  ];

  // Mock data
  const users: Friend[] = [
    { username: 'User 1', status: 'online', profilePicture: '' }, 
    { username: 'User 2', status: 'online', profilePicture: '' },
    { username: 'User 3', status: 'offline', profilePicture: '' },
    { username: 'User 4', status: 'in game', profilePicture: '' },
    { username: 'User 5', status: 'online', profilePicture: '' },
    { username: 'User 6', status: 'offline', profilePicture: '' },
    { username: 'User 7', status: 'offline', profilePicture: '' },
    { username: 'User 8', status: 'in game', profilePicture: '' },
    { username: 'User 9', status: 'online', profilePicture: '' },
    { username: 'User 10', status: 'online', profilePicture: '' },
  ];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }


  const toggleDropdown = (index: number) => {
    setDropdownOpen(index !== dropdownOpen ? index : null);
  }

  return (
    <div className='relative flex items-center justify-center h-screen w-screen bg-gray-900'>

        {/* Back Button */}
        <BackButton />

        <div className='flex items-center justify-center gap-3 h-3/4 w-3/4'>
            {/* Left : User's channels / Joinable channels */}
            <div className='flex flex-col gap-3 h-full w-1/4'>
            

                <div className='flex flex-col items-center justify-start bg-white rounded-xl shadow-md overflow-y-auto'>

                        {/* Choose channels or join channels */}
                        <div className='flex justify-evenly items-center mb-3 w-full cursor-pointer'>
                            <div className={`flex-1 text-center p-4 ${friendList ? 'bg-indigo-500 text-white font-bold' : 'hover:bg-gray-100 text-indigo-500'}`} 
                                onClick={() => setFriendList(true)}>
                                My friends
                            </div>
                            <div className={`flex-1 text-center p-4 ${friendList ? 'hover:bg-gray-100 text-indigo-500' : 'bg-indigo-500 text-white font-bold'}`} 
                                onClick={() => setFriendList(false)}>
                                <p>All users</p>
                            </div>
                        </div>

                        {
                            friendList ?

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
                                    <div key={index} className='flex items-center justify-between p-4 border-b border-gray-200 hover:bg-indigo-200 '>
                                        {/* Profile Picture and Username */}
                                        <div className='flex items-center'>
                                            <div className='h-12 w-12 bg-pp bg-contain rounded-full mr-4' />
                                            <p className='text-gray-700'>{friend.username}</p>
                                        </div>
                                        {/* Status */}
                                        <div>
                                            <p className={`
                                                text-xs 
                                                ${friend.status === 'online' ? 'text-green-400' : 
                                                friend.status === 'offline' ? 'text-red-400' :
                                                friend.status === 'in game' ? 'text-orange-400' : ''}
                                            `}>
                                                {friend.status}
                                            </p>

                                            {/* <div className={`
                                                h-3 w-3 
                                                rounded-full 
                                                ${friend.status === 'online' ? 'bg-green-400' : 
                                                friend.status === 'offline' ? 'bg-red-400' :
                                                friend.status === 'in game' ? 'bg-orange-400' : ''}
                                            `}/> */}
                                        </div>

                                        {/* Actions */}
                                        <div className='relative'>
                                            <BsThreeDots className='text-gray-500 cursor-pointer' onClick={() => toggleDropdown(index)} />
                                            {dropdownOpen === index && (
                                                <div className='absolute z-20 right-0 w-40 mt-2 bg-white border rounded shadow-xl'>
                                                    <a href="#" className='transition-colors duration-200 block px-4 py-2 text-normal text-gray-900 rounded hover:bg-indigo-500 hover:text-white'>Invite to play</a>
                                                    <a href="#" className='transition-colors duration-200 block px-4 py-2 text-normal text-gray-900 rounded hover:bg-indigo-500 hover:text-white'>Delete friend</a>
                                                    <a href="#" className='transition-colors duration-200 block px-4 py-2 text-normal text-gray-900 rounded hover:bg-indigo-500 hover:text-white'>Block friend</a>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>

                            :

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
                                {users.map((friend, index) => (
                                    <div key={index} className='flex items-center justify-between p-4 border-b border-gray-200 hover:bg-indigo-200 '>
                                        {/* Profile Picture and Username */}
                                        <div className='flex items-center'>
                                            <div className='h-12 w-12 bg-pp bg-contain rounded-full mr-4' />
                                            <p className='text-gray-700'>{friend.username}</p>
                                        </div>
                                        {/* Status */}
                                        <div>
                                            <p className={`
                                                text-xs 
                                                ${friend.status === 'online' ? 'text-green-400' : 
                                                friend.status === 'offline' ? 'text-red-400' :
                                                friend.status === 'in game' ? 'text-orange-400' : ''}
                                            `}>
                                                {friend.status}
                                            </p>

                                            {/* <div className={`
                                                h-3 w-3 
                                                rounded-full 
                                                ${friend.status === 'online' ? 'bg-green-400' : 
                                                friend.status === 'offline' ? 'bg-red-400' :
                                                friend.status === 'in game' ? 'bg-orange-400' : ''}
                                            `}/> */}
                                        </div>

                                        {/* Actions */}
                                        <div className='relative'>
                                            <BsThreeDots className='text-gray-500 cursor-pointer' onClick={() => toggleDropdown(index)} />
                                            {dropdownOpen === index && (
                                                <div className='absolute z-20 right-0 w-40 mt-2 bg-white border rounded shadow-xl'>
                                                    <a href="#" className='transition-colors duration-200 block px-4 py-2 text-normal text-gray-900 rounded hover:bg-indigo-500 hover:text-white'>Add friend</a>
                                                    <a href="#" className='transition-colors duration-200 block px-4 py-2 text-normal text-gray-900 rounded hover:bg-indigo-500 hover:text-white'>Invite to play</a>
                                                    <a href="#" className='transition-colors duration-200 block px-4 py-2 text-normal text-gray-900 rounded hover:bg-indigo-500 hover:text-white'>Block friend</a>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>

                        }

                </div>

            </div>

            {/* Right : Chat */}
            <div className='flex flex-col bg-white rounded-xl shadow-md p-8 h-full w-2/4'>

                {/* Chat messages */}
                <div className='flex flex-col h-full w-full overflow-y-auto mb-4'>
                    {/* Mock Messages - Do mapped messages here */}
                    <div className='self-start flex flex-row items-start bg-blue-200 rounded-xl p-2 mt-2'>
                        {/* Profile Picture */}
                        <div className='flex-shrink-0 h-10 w-10 bg-pp bg-cover rounded-full mr-3 hover:cursor-pointer'/> 
                        <div>
                            {/* Name and time */}
                            <p>Bob · 3:05 AM</p> 
                            {/* Message */}
                            <p>Hi, how are you zack hey sjajdksa kdsa lasld kwako sadjmklosa jdw sdnd sajnb dlwan jsn dkjasnwj sakbdkhaw! dsamk dsamlkdwanj dsanjlaw njkmlsdn bkawbsajl ndsajdwnanjskdsa sakd mskad jsadkjmsa?</p> 
                        </div>
                    </div>
                    <div className='self-end flex flex-row items-start bg-green-200 rounded-xl p-2 mt-2'>
                        {/* Profile Picture */}
                        <div className='flex-shrink-0 h-10 w-10 bg-pp bg-cover rounded-full mr-3 hover:cursor-pointer'/> 
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
                    <BiSolidSend className='text-indigo-500 hover:cursor-pointer' size='1.5em'/>
                </div>

            </div>

        </div>

    </div>
  )

}

export default Friends;