import React from 'react';
import Link from 'next/link';

interface MessageBlurProps {
    username: string;
    time: string;
    message: string;
}

const MessageBlur: React.FC<MessageBlurProps> = ({ username, time, message }) => {
    return (
        <div className='max-w-[75%] self-start flex flex-row items-start bg-blue-200 rounded-xl p-2 mt-2'>
            <div className='blur-md flex-shrink-0 h-10 w-10 bg-pp bg-cover rounded-full mr-3 hover:cursor-pointer'/> 
            <div className='blur-md' style={{ userSelect: 'none', pointerEvents: 'none' }}>
                <p>{username} · {time}</p> 
                <p >{message}</p>
            </div>
        </div>
    );
}

export default MessageBlur;
