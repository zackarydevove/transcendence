import React, { ChangeEvent } from 'react';
import { useStore } from '@/state/store';

const InviteUsers: React.FC = () => {
    const handleUserInvite = (e: ChangeEvent<HTMLInputElement>) => {
        // implement the logic to invite users
    }

    const { setShowInviteModal } = useStore(state => state.chat);

    return (
        <div className='absolute z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex justify-center items-center'
            onClick={() => setShowInviteModal(false)}>
            <div className='z-30 relative bg-white rounded-xl p-8 pt-0'
                onClick={(e) => e.stopPropagation()}>
                {/* Form for inviting users */}
                <div className='mt-5'>
                    <div className='mb-4'>
                        <label htmlFor="userEmail" className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
                        <input  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500' 
                                id="userEmail" 
                                type="email" 
                                placeholder="Enter username" 
                                onChange={handleUserInvite}
                        />
                    </div>
                    <button className='w-full py-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-indigo-600'>
                        Invite User
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InviteUsers;
