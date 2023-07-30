import React, { useState, ChangeEvent, FC } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface User {
    id: string;
    username: string;
    role: string;
}

interface SettingsProps {
  setSettings: (val: boolean) => void;
  channelName: string;
  setChannelName: (val: string) => void;
  channelPassword: string;
  setChannelPassword: (val: string) => void;
  users: User[];
  kickUser: (userId: string) => void;
  muteUser: (userId: string) => void;
  banUser: (userId: string) => void;
  setShowInviteModal: (showInviteModal: boolean) => void;
  setShowLeaveModal: (showLeaveModal: boolean) => void;
  setShowEraseModal: (showEraseModal: boolean) => void;
}

const Settings: FC<SettingsProps> = ({ 
  setSettings, channelName, setChannelName, 
  channelPassword, setChannelPassword, users, 
  kickUser, muteUser, banUser, setShowInviteModal,
  setShowLeaveModal, setShowEraseModal }) => {

    const handleChannelNameChange = (e: ChangeEvent<HTMLInputElement>) => setChannelName(e.target.value);
    const handleChannelPasswordChange = (e: ChangeEvent<HTMLInputElement>) => setChannelPassword(e.target.value);
    const inviteUsers = () => { /* api call to invite users */ }
    const leaveChannel = () => { /* api call to leave channel */ }
    const eraseChannel = () => { /* api call to erase channel */ }

    return (
        <div className='relative flex flex-col bg-white rounded-xl shadow-md p-8 h-full w-2/4 overflow-auto'>
            <div className='absolute top-2 right-2 cursor-pointer' onClick={() => setSettings(false)}>
                <AiOutlineClose size={'1.6em'} className='text-indigo-500 hover:text-indigo-600'/>
            </div>
            <div className='flex flex-col gap-4 pb-8'> 
                {/* This div contains non-scrollable elements */}
                <label className='text-gray-500'>Channel Name:</label>
                <input 
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
                    type="text" 
                    value={channelName}
                    onChange={handleChannelNameChange}
                />
                <label className='text-gray-500'>Channel Password:</label>
                <input 
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
                    type="password" 
                    value={channelPassword}
                    onChange={handleChannelPasswordChange}
                />
            </div>
            <label className='text-gray-500'>Users:</label>
            <div className='overflow-y-auto max-h-[50vh]'>
                {/* Channel members list */}
                <div className='flex flex-col'>
                    {users.map((user, index) => (
                    <div key={index} className='flex items-center justify-between gap-4 pr-5 py-1'>
                        <div className='h-10 w-10 bg-pp bg-contain rounded-full hover:cursor-pointer'/>
                        <p className='text-gray-700 flex-grow'>{user.username}</p>
                        <div className='flex gap-2'>
                            <button className='px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700' onClick={() => kickUser(user.id)}>Kick</button>
                            <button className='px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-700' onClick={() => muteUser(user.id)}>Mute</button>
                            <button className='px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700' onClick={() => banUser(user.id)}>Ban</button>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            {/* Channel setting buttons */}
            <div className='flex flex-col gap-4 pt-4'>
                {/* Invite users */}
                <button className='w-full py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75' 
                    onClick={() => setShowInviteModal(true)}>
                        Invite Users
                </button>
                {/* Leave channel */}
                <button className='w-full py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75'
                    onClick={() => setShowLeaveModal(true)}>
                        Leave Channel
                </button>
                {/* Erase channel */}
                <button className='w-full py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75'
                    onClick={() => setShowEraseModal(true)}>
                        Erase Channel
                </button>
            </div>
        </div>
    )
}

export default Settings;
