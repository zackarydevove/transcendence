import React, { useState, ChangeEvent } from 'react';
import { FaLock, FaTrophy, FaSearch } from 'react-icons/fa';
import { BiPlus, BiSolidSend } from 'react-icons/bi';
import BackButton from '../components/BackButton';

interface Group {
  username: string;
}

const Chat: React.FC = () => {
    const [search, setSearch] = useState<string>('');
    const [createOpen, setCreateOpen] = useState<boolean>(false);
    const [userChannels, setUserChannels] = useState<boolean>(true);
    const [groupType, setGroupType] = useState<string>('public');
    const [password, setPassword] = useState<string>('');

    const groups: Group[] = [
        { username: "Group 1" },
        { username: "Group 2" },
        { username: "Group 3" },
        { username: "Group 4" },
        { username: "Group 5" },
        { username: "Group 6" },
        { username: "Group 7" },
        { username: "Group 8" },
        { username: "Group 9" },
        { username: "Group 10" },
    ];

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    }

    const handleUserChannels = () => {
        setUserChannels(!userChannels);
    }

    const handleGroupTypeChange = (groupType: string) => {
        setGroupType(groupType);
    }

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    return (
        <div className='relative flex items-center justify-center h-screen w-screen bg-gray-900'>

            {/* Back Button */}
            <BackButton />

            {
                createOpen ?
                    <div className='absolute z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex justify-center items-center'
                        onClick={() => setCreateOpen(false)}>
                        <div className='z-30 relative w-1/4 h-[330px] bg-white rounded-xl p-8 pt-0'
                            onClick={(e) => e.stopPropagation()}>
                            {/* Form for creating a new group */}
                            <div className='mt-5'>
                                <div className='mb-4'>
                                    <label htmlFor="groupName" className="block text-gray-700 text-sm font-bold mb-2">Group Name:</label>
                                    <input  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500' 
                                            id="groupName" 
                                            type="text" 
                                            placeholder="Enter group name" 
                                    />
                                </div>

                                <div className='mb-4 flex'>
                                    <div 
                                        className={`p-4 text-center hover:cursor-pointer flex-grow ${groupType === 'public' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200 text-indigo-500'}`} 
                                        onClick={() => handleGroupTypeChange('public')}>
                                        <p>PUBLIC</p>
                                    </div>
                                    <div 
                                        className={`p-4 text-center hover:cursor-pointer flex-grow ${groupType === 'protected' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200 text-indigo-500'}`} 
                                        onClick={() => handleGroupTypeChange('protected')}>
                                        <p>PROTECTED</p>
                                    </div>
                                    <div 
                                        className={`p-4 text-center hover:cursor-pointer flex-grow ${groupType === 'private' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200 text-indigo-500'}`} 
                                        onClick={() => handleGroupTypeChange('private')}>
                                        <p>PRIVATE</p>
                                    </div>  
                                </div>

                                {groupType === 'protected' && 
                                    <div className='mb-4'>
                                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                                        <input  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500' 
                                                id="password" 
                                                type="password" 
                                                placeholder="Enter channel's password" 
                                                value={password}
                                                onChange={handlePasswordChange}
                                        />
                                    </div>
                                }

                                <button className='w-full py-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-white hover:text-indigo-500 hover:border hover:border-indigo-500'>
                                    Create Group
                                </button>
                            </div>
                        </div>
                    </div>
                : null
            }

            <div className='flex items-center justify-center gap-3 h-3/4 w-3/4'>
                {/* Left : User's channels / Joinable channels */}
                <div className='relative flex flex-col gap-3 h-full w-1/4'>
                
                    <div className=' flex flex-col items-center justify-start bg-white rounded-xl shadow-md overflow-y-auto'>
                    
                    <button className='absolute top-1 -left-16 p-2 rounded-full bg-indigo-500 text-white hover:bg-white hover:text-indigo-500 transition flex items-center justify-center'
                        onClick={() => setCreateOpen(true)}
                    >
                        <BiPlus size='1.7em'/>
                    </button>

                    {/* Choose channels or join channels */}
                        <div className='flex justify-evenly items-center mb-3 w-full cursor-pointer'>
                            <div className={`flex-1 text-center p-4 ${userChannels ? 'bg-indigo-500 text-white font-bold' : 'hover:bg-gray-100 text-indigo-500'}`} 
                                onClick={() => setUserChannels(true)}>
                                My channels
                            </div>
                            <div className={`flex-1 text-center p-4 ${userChannels ? 'hover:bg-gray-100 text-indigo-500' : 'bg-indigo-500 text-white font-bold'}`} 
                                onClick={() => setUserChannels(false)}>
                                <p>Join channels</p>
                            </div>
                        </div>

                    {
                        userChannels ? 

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

                        :

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
                        <BiSolidSend className='text-indigo-500' size='1.5em'/>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default Chat;