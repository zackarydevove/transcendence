"use client"
import React, { ChangeEvent, useEffect } from 'react';
import { BsCameraFill } from 'react-icons/bs';
import { useStore } from '@/state/store';
import { useState } from 'react';
import useUserContext from '@contexts/UserContext/useUserContext';
import useNotificationContext from '@contexts/NotificationContext/useNotificationContext';
import { User } from '@interface/Interface';
import { getUserByUsername } from '@api/friends';

interface ProfileDataProps {
  username: string | string[] | undefined;
}

const ProfileData: React.FC<ProfileDataProps> = ({ username }) => {
    const [changeUsername, setChangeUsername] = useState<string>('');
    const [user, setUser] = useState<User>();

	const profile = useUserContext((state) => state.profile);
	const notifcationCtx = useNotificationContext();
    const { isHovered, setIsHovered } = useStore(state => state.profile);

	// Fetch user to have information (nb of wins, losses, etc.)
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const fetchedUser = await getUserByUsername(username);
				setUser(fetchedUser);
			} catch (error) {
				console.error('Error fetching user:', error);
			}
		};
	
		fetchUser();
	}, [username]);


    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (profile?.id !== user?.id) {
			notifcationCtx.enqueueNotification({
				message: `You can modify only your username`,
				type: "default"
			});
			return ;
		} 
        setChangeUsername(event.target.value);
    }
    
    const onHover = (x: boolean) => {
        setIsHovered(x);
    }

    return (
        <div className='flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-8'>
            {/* Profile Picture */}
            <div className='relative flex items-center justify-evenly mb-4 w-full'>
                <div className='flex justify-center items-center h-24 w-24 bg-pp bg-cover rounded-full border border-gray-200 hover:cursor-pointer'
                onMouseEnter={() => onHover(true)}
                onMouseLeave={() => onHover(false)}>
                    <BsCameraFill className={`${isHovered ? '' : 'hidden'}`} size={'2em'} />
                </div>
                <div className='ml-4'>
                    <div className='flex gap-1'>
                        <p>{user ? user.wins : 0} W</p>
                        <p>{user ? user.losses : 0} L</p>
                    </div>
                    <p>Winrate: {user ? ( user.wins / (user.wins + user.losses) * 100).toFixed(2) : 0}%</p>
                    <p>{user ? user.points : 0} Points</p>
                </div>
            </div>
            {/* Username */}
            <div className='mb-4 w-full'>
                <p className='text-gray-500 mb-2'>Username</p>
                <input 
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
                    type='text'
                    value={user ? username : "User don't exist"}
                    onChange={handleUsernameChange}
                />
            </div>

        </div>
    );
}

export default ProfileData;
