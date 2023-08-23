"use client"
import React, { useEffect, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { useStore } from '@/state/store';
import useUserContext from '@contexts/UserContext/useUserContext';
import { getFriends, addFriend, deleteFriend, blockUser, unblockUser, getBlockedUsers, getFriendship, getUsers } from '@api/friends';

const FriendList: React.FC = () => {
	const [fetch, setFetch] = useState<boolean>(true);
    const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
    const [fetchBlock, setFetchBlockedUsers] = useState<string[]>([]);
    const {
			dropdownOpen,
			setDropdownOpen,
			friendList,
			search,
			friends,
			setFriends,
			setActiveFriendship
	} = useStore(state => state.friends);

	const profile = useUserContext((state) => state.profile);

	const toggleDropdown = (event: any, index: number) => {
		// Stop the click event from propagating to parent elements
		event.stopPropagation();
		setDropdownOpen(index === dropdownOpen ? -1 : index);
	}
	
    const fetchList = async () => {
        try {
            // Fetch friends or users based on the friendList boolean
            const fetchedData = friendList ? await getFriends(profile.id) : await getUsers();

            // Check if the fetched data is not empty
            if (fetchedData && Array.isArray(fetchedData) && fetchedData.length > 0) {
                // Exclude the current user's profile from the list if fetching all users
                if (!friendList) {
                    const filteredData = fetchedData.filter(userItem => userItem.username !== profile.username);
                    setFriends(filteredData);
                } else {
                    setFriends(fetchedData);
                }
            } else {
				// Set an empty list if no data is returned
                setFriends([]);
            }
        } catch (error) {
            console.error('Error fetching list:', error);
		}
    };

	// get friend or user list
    useEffect(() => {
        fetchList();
    }, [fetch, friendList]);

    // Fetch the blocked users when component mounts
    // useEffect(() => {
    //     async function fetchBlockedUsers() {
    //         try {
    //             const result = await getBlockedUsers(profile.id);
    //             setBlockedUsers(result);  // Assuming result is an array of usernames that are blocked
    //         } catch (error) {
    //             console.error("Failed to fetch blocked users:", error);
    //         }
    //     }
    //     fetchBlockedUsers();
    // }, [fetchBlock]);

	// check if a profile is blocked to show "unblock" instead
    const isUserBlocked = (username: string) => {
        return blockedUsers.includes(username);
    };

	// for the searchbar
	const filteredList = friends.filter(friend => 
		friend.username.toLowerCase().includes(search.toLowerCase())
	);

	// Get the friendship id to open the chat
	async function getFriendChat(friend: any) {
		try {
			const friendship: any = await getFriendship(profile.id, friend.id);
			setActiveFriendship(friendship);
		} catch (error) {
			console.error("Failed to get friendship id: ", error);
		}
	};

	// Add user to friend
	async function handleAddFriend(friendId: string) {
		try {
			const updatedUser = await addFriend(profile.id, friendId);
			setFetch(!fetch);
		} catch (error) {
			console.error("Failed to add friend: ", error);
		}
	}

    // Delete user from friend
    const handleDeleteFriend = async (friendId: string) => {
        try {
            const updatedUser = await deleteFriend(profile.id, friendId);
            setFetch(!fetch);
        } catch (error) {
            console.error("Failed to delete friend: ", error);
        }
    }

	// block a user
    // async function handleBlockUser(blockedId: string) {
    //     try {
    //         await blockUser(profile.id, blockedId);
    //         setFetch(!prev);
    //         setFetchBlock(!prev);
    //     } catch (error) {
    //         console.error("Failed to block profile:", error);
    //     }
    // }

	// unblock a user
    // async function handleUnblockUser(blockedId: string) {
    //     try {
    //         await unblockUser(profile.id, blockedId);
    //         setFetch(!prev);
    //         setFetchBlock(!prev);
    //     } catch (error) {
    //         console.error("Failed to unblock profile:", error);
    //     }
    // }

	return (
		<div className='w-full h-full overflow-y-auto'>	
			{filteredList.map((friend, index) => (
				<div
					key={index}
					className='flex items-center justify-between p-4 border-b border-gray-200 hover:bg-indigo-200 hover:cursor-pointer'
					onClick={() => {
						if(friendList) {
							getFriendChat(friend);
						}
					}}
					>

					{/* Profile Picture and Username */}
					<div className='flex items-center'>
						<div className='h-12 w-12 bg-pp bg-contain rounded-full mr-4' />
						<p className='text-gray-700'>{friend.username}</p>
					</div>

					{/* Status */}
					<div>
						<div className={`
							h-3 w-3 
							rounded-full 
							${friend.status === 'online' ? 'bg-green-500' : 
							friend.status === 'offline' ? 'bg-red-500' :
							friend.status === 'ingame' ? 'bg-yellow-400' : ''}
						`}/>
					</div>

					{/* Actions */}
					<div className='relative'>
						<BsThreeDots className='text-gray-500 cursor-pointer'
									onClick={(event: any) => toggleDropdown(event, index)} />
						{dropdownOpen === index && (
							<div className='absolute z-20 right-0 w-40 mt-2 bg-white border rounded shadow-xl'>
								<div className='transition-colors duration-200 block px-4 py-2 text-normal text-gray-900 rounded hover:bg-indigo-500 hover:text-white'>Invite to play</div>
								<div 
									onClick={() => friendList ? handleDeleteFriend(friend.id) : handleAddFriend(friend.id)}
									className='transition-colors duration-200 block px-4 py-2 text-normal text-gray-900 rounded hover:bg-indigo-500 hover:text-white'
									>
										{friendList ? "Delete friend" : "Add friend"}
								</div>
								<div className='transition-colors duration-200 block px-4 py-2 text-normal text-gray-900 rounded hover:bg-indigo-500 hover:text-white'
									// onClick={isUserBlocked(friend.username) ? handleUnblockUser(friend.id) : handleBlockUser(friend.id)}
								>
									{isUserBlocked(friend.username) ? "Unblock profile" : "Block profile"}
								</div>
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	);
}

export default FriendList;
