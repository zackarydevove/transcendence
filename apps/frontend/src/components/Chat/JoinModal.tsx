import React from 'react';
import { useStore } from '@/state/store';
import { addMember } from '@api/chat';
import useUserContext from '@contexts/UserContext/useUserContext';

const JoinModal: React.FC = () => {

    const { setShowJoinModal, clickedGroup } = useStore(state => state.chat);
	const profile = useUserContext((state) => state.profile);

	const handleAddMember = async () => {
		if (clickedGroup) {
			const res = await addMember(clickedGroup.id, profile.id);
			console.log(res);
			setShowJoinModal(false);
		}
	}

    return (
        <div className='absolute z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex justify-center items-center'
            onClick={() => setShowJoinModal(false)}>
            <div className='z-30 relative bg-white rounded-xl p-8 pt-0'
                onClick={(e) => e.stopPropagation()}>
                {/* Confirmation for kicking the user */}
                <div className='mt-5'>
                    <p className='mb-4 text-center'>Are you sure you want to join this channel?</p>

                    <button className='w-full py-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-indigo-600'
                            onClick={() => handleAddMember()}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default JoinModal;
