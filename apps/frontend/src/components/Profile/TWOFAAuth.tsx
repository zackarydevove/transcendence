
'use client';

import useUserContext from '@contexts/UserContext/useUserContext';
import React from 'react';
import { FaLock } from 'react-icons/fa';

const TWOFAAuth: React.FC = () => {

    const toggleTwoFactor = useUserContext((state) => state.toggleTwoFactor)
    const profile = useUserContext((state) => state.profile)

    return profile && (
        <div className='flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-8'>
            {/* 2FA */}
            <button onClick={toggleTwoFactor} className='flex justify-center items-center w-full py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 hover:cursor-pointer'>
                <FaLock className='inline-block mr-2' size={20} />
                {profile?.twoFactorEnabled ? "Disable" : "Enable"} 2FA by Email
            </button>
        </div>
    );
}

export default TWOFAAuth;
