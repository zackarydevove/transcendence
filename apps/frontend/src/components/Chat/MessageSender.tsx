import React from 'react';

interface MessageSenderProps {
    time: string;
    message: string;
}

const MessageSender: React.FC<MessageSenderProps> = ({ time, message }) => {
    return (
        <div className='max-w-[75%] self-end flex flex-row items-start bg-green-200 rounded-xl p-2 mt-2'>
            <div className='flex-shrink-0 h-10 w-10 bg-pp bg-cover rounded-full mr-3 hover:cursor-pointer'/> 
            <div>
                <p>You · {time}</p> 
                <p>{message}</p>
            </div>
        </div>
    );
}

export default MessageSender;
