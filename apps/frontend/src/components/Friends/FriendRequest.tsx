import React, { useEffect, useState } from 'react'
import { useStore } from '@/state/store';
import Link from 'next/link';
import { acceptFriendRequest, declineFriendRequest, fetchFriendRequests } from '@api/friends';
import useUserContext from '@contexts/UserContext/useUserContext';
import { Request } from '@interface/Interface';
import useNotificationContext from '@contexts/NotificationContext/useNotificationContext';
import { createAvatarUrl } from '@utils/createUrl';
import socket from '@utils/socket';

const FriendRequest: React.FC = () => {
	const [fetch, setFetch] = useState<boolean>(true);
	const [pendingUserId, setPendingUserId] = useState<string>("");

    const { setFriendRequestOpen, friendRequestOpen } = useStore(state => state.friends);

    const [request, setRequest] = useState<Request[]>([]);
	const profile = useUserContext((state) => state.profile);
	const notifcationCtx = useNotificationContext();

    useEffect(() => {
		if (!profile) return;
        async function fetchRequests() {
            const data = await fetchFriendRequests(profile?.id);
            setRequest(data);
        }
        fetchRequests();
    }, [profile]);

	// socket
	useEffect(() => {
		socket.on('refetch', (data) => {
			if (data.component === "FriendRequest") {
				// Save the userId for later use if this happen faster than profile context
				if (!profile) {
					setPendingUserId(data.userId); 
					return;
				}
				if (profile.id === data.userId) {
					setFetch(!fetch);
				}
			}
		});

		return () => {
			socket.off('refetch');
		};
	}, []);

	// Handle the pendingUserId
	useEffect(() => {
		if (profile && pendingUserId) {
			if (profile.id === pendingUserId) {
				setFetch(!fetch);
			}
			setPendingUserId("");
		}
	}, [profile, pendingUserId]);

    const handleAccept = async (request: Request) => {
        const response = await acceptFriendRequest(profile?.id, request.id);
        if (response.ok) {
        	setRequest(prevRequest => prevRequest?.filter(request => request.id !== request.id));
			notifcationCtx.enqueueNotification({
				message: `Friend request accepted.`,
				type: "default"
			});
			socket.emit('refetch', { friendId: request.requester.id, component: "FriendList" });
			setFetch(!fetch);
		} else {
			notifcationCtx.enqueueNotification({
				message: `An error has occured trying to accept Friend request.`,
				type: "default"
			});
		}
    }

    const handleDecline = async (friendRequestId: string) => {
        const response = await declineFriendRequest(profile?.id, friendRequestId);
		if (response.ok) {
			setRequest(prevRequest => prevRequest?.filter(request => request.id !== friendRequestId));
			notifcationCtx.enqueueNotification({
				message: `Friend request declined.`,
				type: "default"
			});
		} else {
			notifcationCtx.enqueueNotification({
				message: `An error has occured trying to decline Friend request.`,
				type: "default"
			});
		}
    }
	console.log(request?.[0]);
  return (
    <div className='absolute z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex justify-center items-center'
        onClick={() => setFriendRequestOpen(false)}>
            <div className='z-30 relative sm:w-[450px] sm:h-[330px] bg-white rounded-xl p-8 pt-0 overflow-auto'
                onClick={(e) => e.stopPropagation()}>
				<div className=' max-h-[50vh] flex flex-col gap-4 py-4'>
					{request?.map((request) => (
						<div key={request.id} className='flex items-center justify-between gap-4 pr-5 py-1'>
							<div className='flex items-center gap-4'>
								<Link href={`/profile/${request.requester.username}`}>
									<div className='h-10 w-10 bg-cover rounded-full hover:cursor-pointer' style={{ backgroundImage:createAvatarUrl(request.requester.avatar)}}/>
								</Link>
								<p className='text-gray-700'>{request.requester.username}</p>
							</div>
							<div className='flex gap-2'>
								<button className='w-full py-2 px-4 rounded-md bg-green-500 text-white hover:bg-green-600'
									onClick={() => handleAccept(request)}>Accept</button>
								<button className='w-full py-2 px-4 rounded-md bg-red-500 text-white hover:bg-red-600'	
									onClick={() => handleDecline(request.id)}>Decline</button>
							</div>
						</div>
					))}
				</div>
            </div>
    </div>
  )
}

export default FriendRequest