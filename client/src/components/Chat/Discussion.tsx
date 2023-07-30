import React from 'react';
import { AiFillSetting } from 'react-icons/ai';
import { BiSolidSend } from 'react-icons/bi';

interface Message {
    sender: string;
    timestamp: string;
    text: string;
}

interface DiscussionProps {
    setSettings: (settings: boolean) => void;
}

const Discussion: React.FC<DiscussionProps> = ({ setSettings }) => {
    // Mock Messages 
    const messages: Message[] = [
        {
            sender: 'Bob',
            timestamp: '3:05 AM',
            text: 'Hi, how are you zack hey sjajdksa kdsa lasld kwako sadjmklosa jdw sdnd sajnb dlwan jsn dkjasnwj sakbdkhaw! dsamk dsamlkdwanj dsanjlaw njkmlsdn bkawbsajl ndsajdwnanjskdsa sakd mskad jsadkjmsa?',
        },
        {
            sender: 'You',
            timestamp: 'Now',
            text: 'I\'m good, how about you?',
        }
    ];

    return (
        <div className='relative flex flex-col bg-white rounded-xl shadow-md p-8 h-full w-2/4'>
            {/* Setting button */}
            <div className='absolute top-2 right-2 cursor-pointer'
                onClick={() => setSettings(true)}>
                <AiFillSetting size={'1.6em'} className='text-indigo-500 hover:text-indigo-600'/>
            </div>

            {/* Chat messages */}
            <div className='flex flex-col h-full w-full overflow-y-auto mb-4'>
                {messages.map((message, index) => (
                    <div key={index} className={message.sender === 'You' ? 'self-end flex flex-row items-start bg-green-200 rounded-xl p-2 mt-2' : 'self-start flex flex-row items-start bg-blue-200 rounded-xl p-2 mt-2'}>
                        {/* Profile Picture */}
                        <div className='flex-shrink-0 h-10 w-10 bg-pp bg-cover rounded-full mr-3 hover:cursor-pointer'/> 
                        <div>
                            {/* Name and time */}
                            <p>{message.sender} · {message.timestamp}</p> 
                            {/* Message */}
                            <p>{message.text}</p> 
                        </div>
                    </div>
                ))}
            </div>

            {/* Send a message */}
            <div className='w-full flex items-center justify-start border-t-2 border-gray-200 pt-2'>
                <input className='mr-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500' placeholder='Type a message' />
                <BiSolidSend className='text-indigo-500' size='1.5em'/>
            </div>
        </div>
    );
}

export default Discussion;
