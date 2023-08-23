import React from 'react';
import { useStore } from '@/state/store';
import { deleteChat } from '@api/chat';
import useUserContext from '@contexts/UserContext/useUserContext';
import useNotificationContext from '@contexts/NotificationContext/useNotificationContext';

const EraseChannel: React.FC = () => {

    const { setShowEraseModal, activeChannel, setActiveChannel, myGroups, setMyGroups, setSettings } = useStore(state => state.chat);

	const profile = useUserContext((state) => state.profile);
	const notifcationCtx = useNotificationContext();

    const handleEraseChannel = async () => {
        if (activeChannel && activeChannel.id) {
            try {
                const response = await deleteChat(activeChannel.id, profile.id);
				if (response.ok) {
					setActiveChannel(null);
					setSettings(false);
					const updatedGroups = myGroups.filter(group => group.id !== activeChannel.id);
					setMyGroups(updatedGroups);
				} else {
					notifcationCtx.enqueueNotification({
					message: "You can't delete this channel",
					type: "default"
					})
				}
				setShowEraseModal(false);
            } catch (error) {
                console.error("Error calling the API:", error);
            }
        }
    }

    return (
        <div className='absolute z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex justify-center items-center'
            onClick={() => setShowEraseModal(false)}>
            <div className='z-30 relative bg-white rounded-xl p-8 pt-0'
                onClick={(e) => e.stopPropagation()}>
                {/* Confirmation for erasing the channel */}
                <div className='mt-5'>
                    <p className='mb-4 text-center'>Are you sure you want to erase this channel?</p>

                    <button className='w-full py-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-indigo-600'
                            onClick={handleEraseChannel}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EraseChannel;