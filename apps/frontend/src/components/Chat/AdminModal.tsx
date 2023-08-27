import React from 'react';
import { useStore } from '@/state/store';
import { setAdmin } from '@api/chat';
import useUserContext from '@contexts/UserContext/useUserContext';

const AdminModal: React.FC = () => {

    const { setShowAdminModal, activeChannel, targetMember } = useStore(state => state.chat);
	const profile = useUserContext((state) => state.profile);

	const handleSetAdmin = async () => {
		if (activeChannel && targetMember) {
			const res = await setAdmin(activeChannel.id, profile.id, targetMember.user.id);
			console.log(res);
			setShowAdminModal(false);
		}
	}

    return (
        <div className='absolute z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex justify-center items-center'
            onClick={() => setShowAdminModal(false)}>
            <div className='z-30 relative bg-white rounded-xl p-8 pt-0'
                onClick={(e) => e.stopPropagation()}>
                <div className='mt-5'>
                    <p className='mb-4 text-center'>Are you sure you want to set {targetMember?.user.username} as Admin in this channel?</p>

                    <button className='w-full py-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-indigo-600'
                            onClick={() => handleSetAdmin()}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminModal;
