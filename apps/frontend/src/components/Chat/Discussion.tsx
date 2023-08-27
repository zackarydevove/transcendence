import React, { useState, useEffect, useRef } from 'react';
import { AiFillSetting } from 'react-icons/ai';
import { BiSolidSend } from 'react-icons/bi';
import { useStore } from '@/state/store';
import { Message } from '@interface/Interface';
import useUserContext from '@contexts/UserContext/useUserContext';
import socket from '../../../socket';
import { getChatMessages, sendMessage, isMuted } from '@api/chat';
import MessageReceiver from './MessageReceiver';
import MessageSender from './MessageSender';
import { messageDate } from '@utils/formatDate';
import useNotificationContext from '@contexts/NotificationContext/useNotificationContext';

const Discussion: React.FC = () => {
    const [messageContent, setMessageContent] = useState<string>('');
    const [] = useState<Message[]>([]);
    const { setSettings, activeChannel, setActiveChannel, messages, setMessages } = useStore(state => state.chat);

    const profile = useUserContext((state) => state.profile);
	const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (activeChannel && activeChannel.id) {
            socket.emit('joinChat', { chatId: activeChannel.id } );

            socket.on('newMessage', (newMessage: Message) => {
				setMessages(prevMessages => [...prevMessages, newMessage]);
            });

            return () => {
                socket.off('newMessage');
                socket.emit('quitChat', activeChannel.id);
            };
        }
    }, [activeChannel]);

	// Scroll to the bottom
	useEffect(() => {
		scrollRef.current?.scrollIntoView();
		console.log("messages: ", messages);
	}, [messages]);

	// get messages from database on mount
	useEffect(() => {
		if (activeChannel) {
			getChatMessages(activeChannel.id)
			.then(fetchedMessages => {
				setMessages(fetchedMessages);
		  	});
		}
	}, [activeChannel]);

	const notifcationCtx = useNotificationContext();

	const handleSendMessage = async () => {
		if (messageContent.trim() && activeChannel) {
			try {
				const res = await isMuted(activeChannel.id, profile.id);
				if (res.error == "User is not a member of this chat.") {
					notifcationCtx.enqueueNotification({
						message: `You are not member of this channel.`,
						type: "default"
					});
					setActiveChannel(null);
					setMessages([]);
					setSettings(false);
					return ;
				}
				else if (res.isMuted) {
					notifcationCtx.enqueueNotification({
						message: `You are muted for ${res.remainingMinutes} minutes in this channel`,
						type: "default"
					});
					return ;
				} else {
					await sendMessage(activeChannel.id, profile.id, messageContent);
					setMessageContent('');
				}
			} catch (error) {
				console.error("Error sending message:", error);
			}
		}
	};

	console.log("activeChannel Discussion: ", activeChannel);

    return (
        <div className='relative flex flex-col bg-white rounded-xl shadow-md p-8 h-full max-md:hidden md:w-[400px] lg:w-[570px] xl:w-[760px]'>
            {/* Setting button */}
            <div className='absolute top-2 right-2 cursor-pointer'
                onClick={() => setSettings(true)}>
                <AiFillSetting size={'1.6em'} className='text-indigo-500 hover:text-indigo-600'/>
            </div>

            {/* Chat messages */}
            <div className='flex flex-col h-full w-full overflow-y-auto mb-4'>
				{messages?.map((msg: Message, index) => {
						if (msg.sender.username === profile.username) {
							return <MessageSender key={index} time={messageDate(msg.createdAt)} message={msg.content} />;
						} else {
							return <MessageReceiver key={index} username={msg.sender.username} time={messageDate(msg.createdAt)} message={msg.content} />;
						}
					})}
					<div ref={scrollRef}/>
            </div>

            {/* Send a message */}
            <div className='w-full flex items-center justify-start border-t-2 border-gray-200 pt-2'>
                <input
                    className='mr-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
                    placeholder='Type a message'
                    value={messageContent}
                    onChange={e => setMessageContent(e.target.value)}
                />
                <BiSolidSend
					className='text-indigo-500 hover:cursor-pointer'
					size='1.5em'
					onClick={handleSendMessage}
				/>
            </div>
        </div>
    );
}

export default Discussion;
