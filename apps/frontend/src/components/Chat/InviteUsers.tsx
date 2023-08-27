import React, { useState, ChangeEvent, useEffect } from 'react';
import { useStore } from '@/state/store';
import { getUsers } from '@api/friends';
import { User, Invite, ChatType } from '@interface/Interface';
import useNotificationContext from "@contexts/NotificationContext/useNotificationContext";
import useUserContext from '@contexts/UserContext/useUserContext';
import { banUser, inviteUserToChat, getBannedUsers, getInvitedUsers, unbanUser, uninviteUserFromChat  } from '@api/chat';

const InviteUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [banned, setBanned] = useState<String[]>([]);
    const [invited, setInvited] = useState<Invite[]>([]);
    const [search, setSearch] = useState<string>("");
    const [fetch, setFetch] = useState<boolean>(true);

    const { setShowInviteModal, activeChannel } = useStore(state => state.chat);
    const profile = useUserContext((state) => state.profile);

	const notifcationCtx = useNotificationContext();

    useEffect(() => {

		async function fetchBanned() {
			if (activeChannel && activeChannel.id) {
				const result = await getBannedUsers(activeChannel.id);
				if (Array.isArray(result.banned)) {
					setBanned(result.banned);
				} else {
					console.error('Expected banned users to be an array, got:', result);
				}
			}
		}
	
		async function fetchInvited() {
			if (activeChannel && activeChannel.id) {
				const result = await getInvitedUsers(activeChannel.id);
				if (Array.isArray(result)) {
					setInvited(result);
				} else {
					console.error('Expected invited users to be an array, got:', result);
					setInvited([]);
				}
			}
		}

        async function fetchList() {
            try {
                const fetchedData = await getUsers();
                if (fetchedData && Array.isArray(fetchedData) && fetchedData.length > 0) {
                    const filteredData = fetchedData.filter(userItem => userItem.username !== profile.username);
                    setUsers(filteredData);
                } else {
                    setUsers([]);
                }
            } catch (error) {
                console.error('Error fetching list:', error);
            }
        }

        fetchList();
		fetchBanned();
		fetchInvited();
    }, [fetch]);

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const filteredList = users.filter(user => user.username.toLowerCase().includes(search.toLowerCase()));

    const handleAction = async (action: string, target: User) => {
        if (action === "invite") {
			if (activeChannel?.type != "private") {
				notifcationCtx.enqueueNotification({
					message: "This channel is not private so you can't invite users.",
					type: "default"
				})
				return ;
			}
			if (activeChannel?.id && target) {
				const res = invited.some(inv => inv.userId == target.id) 
					? await uninviteUserFromChat(activeChannel.id, profile.id, target.id)
					: await inviteUserToChat(activeChannel.id, profile.id, target.id);
				if (res.ok) {
					setFetch(!fetch);
				}
			}
		} else if (action === "ban") { // chatId: string, adminUserId: string, targetUserId: string
			if (activeChannel && activeChannel.id && target) {
				const res = banned.some(ban => ban == target.id)
					? await unbanUser(activeChannel.id, profile.id, target.id)
					: await banUser(activeChannel.id, profile.id, target.id)
				console.log("Res ban: ", res);
				if (res.ok) {
					console.log("refetch?");
					setFetch(!fetch);
				}
			}
		}
    }


	console.log("banned: ", banned);
	console.log("invited: ", invited);

    return (

		<div className='absolute z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex justify-center items-center'
        onClick={() => setShowInviteModal(false)}>
        <div className='z-30 h-[330px] w-[330px] relative bg-white rounded-xl p-8 pt-0'
            onClick={(e) => e.stopPropagation()}>

            {/* Search Bar */}
            <div className="mb-4 pt-4">
                <input 
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500' 
                    placeholder="Search users..."
                    value={search}
                    onChange={handleSearch}
                />
            </div>

            {/* List of Users */}
            <div className='overflow-y-auto h-[250px]'>
                {filteredList.map(user => (
                    <div key={user.id} className='flex justify-between items-center mb-3'>
                        {/* Profile Picture and Username */}
                        <div className='flex items-center'>
                            <div className='h-12 w-12 bg-pp bg-contain rounded-full mr-4'></div>
                            <p className='text-gray-700'>{user.username}</p>
                        </div>

                        {/* Actions */}
                        <div className='flex gap-2'>
                            <button className='px-2 py-1 bg-amber-500 text-white rounded hover:cursor-pointer hover:bg-amber-700' 
                                onClick={() => handleAction("invite", user)}>{ Array.isArray(invited) && invited.some(inv => inv.userId == user.id) ? "Uninvite" : "Invite" }</button>
                            <button className='px-2 py-1 bg-blue-500 text-white rounded hover:cursor-pointer hover:bg-blue-700' 
                                onClick={() => handleAction("ban", user)}>{ Array.isArray(banned) && banned.some(ban => ban == user.id) ? "Unban" : "Ban" }</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
    );
}

export default InviteUsers;
