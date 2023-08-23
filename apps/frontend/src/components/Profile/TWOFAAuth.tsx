import React from 'react';
import { FaLock } from 'react-icons/fa';

const TWOFAAuth: React.FC = () => {
    return (
        <div className='flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-8'>
            {/* 2FA */}
            <button className='flex justify-center items-center w-full py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 hover:cursor-pointer'>
                <FaLock className='inline-block mr-2' size={20}/>Set 2FA with Google Authenticator
            </button>
        </div>
    );
}

export default TWOFAAuth;
