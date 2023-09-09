import React from 'react';
import Link from 'next/link';

interface MessageReceiverProps {
    username: string;
    time: string;
    message: string;
}

const MessageReceiver: React.FC<MessageReceiverProps> = ({ username, time, message }) => {
    return (
        <div className='max-w-[75%] self-start flex flex-row items-start bg-blue-200 rounded-xl p-2 mt-2'>
			<Link href={`/profile/${username}`}>
            	<div className='flex-shrink-0 h-10 w-10 bg-pp bg-cover rounded-full mr-3 hover:cursor-pointer'/> 
			</Link>
            <div>
                <p>{username} · {time}</p> 
                <p>{message}</p>
            </div>
        </div>
    );
}

export default MessageReceiver;
