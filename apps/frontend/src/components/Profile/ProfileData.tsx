"use client"
import React, { ChangeEvent } from 'react';
import { BsCameraFill } from 'react-icons/bs';
import { useStore } from '@/state/store';

const ProfileData: React.FC = () => {
    // mock data
    let wins: number = 32;
    let losses: number = 17;
    let rankPoints: number = 1230;

    const {
        username, 
        setUsername, 
        isHovered, 
        setIsHovered 
    } = useStore(state => state.profile);


    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
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
                        <p>{wins} W</p>
                        <p>{losses} L</p>
                    </div>
                    <p>Winrate: {(wins / (wins + losses) * 100).toFixed(2)}%</p>
                    <p>{rankPoints} Points</p>
                </div>
            </div>
            {/* Username */}
            <div className='mb-4 w-full'>
                <p className='text-gray-500 mb-2'>Username</p>
                <input 
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
                    type='text'
                    value={username}
                    onChange={handleUsernameChange}
                />
            </div>

        </div>
    );
}

export default ProfileData;
