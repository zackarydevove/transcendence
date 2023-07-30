import React from 'react';

interface ToggleChannelProps {
    userChannels: boolean;
    setUserChannels: (userChannels: boolean) => void;
}

const ToggleChannel: React.FC<ToggleChannelProps> = ({ userChannels, setUserChannels }) => {
    return (
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
    )
}

export default ToggleChannel;