import socket from "../../socket";
const BASE_URL = process.env.BACKEND_URL || "http://localhost:8080";  // adjust the default URL accordingly

// Return user's friend list or empty array
export async function getFriends (userId: string) {
	const response = await fetch(`${BASE_URL}/friends/get/${userId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return response.json();
};

// Return updated user
export async function addFriend (userId: string, friendId: string) {
	const response = await fetch(`${BASE_URL}/friends/add`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ userId, friendId })
	});

	return response.json();
};

// Return all users
export async function getUsers() {
    const response = await fetch(`${BASE_URL}/friends/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.json();
}

// Return updated user
export async function deleteFriend (userId: string, friendId: string) {
	const response = await fetch(`${BASE_URL}/friends/delete`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ userId, friendId })
	});

	return response.json();
};

// Return a response after sending a message
export async function sendFriendMessage (friendshipId: string | undefined, senderId: string, content: string) {
    if (friendshipId == undefined) return;

    socket.emit('sendFriendMessage', {
        friendshipId,
        senderId,
        content,
    });
}

// Return a list of messages within a specific friendship
export async function getFriendshipMessages (friendshipId: string) {
	const response = await fetch(`${BASE_URL}/friends/messages/${friendshipId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		}
	});

	return response.json();
};

// Return updated user
export async function blockUser (userId: string, blockedId: string) {
	const response = await fetch(`${BASE_URL}/friends/block`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ userId, blockedId })
	});

	return response.json();
};

// Return updated user
export async function unblockUser (userId: string, blockedId: string) {
	const response = await fetch(`${BASE_URL}/friends/unblock`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ userId, blockedId })
	});

	return response.json();
};

// Return list of blocked users for a user
export async function getBlockedUsers (userId: string) {
	const response = await fetch(`${BASE_URL}/friends/blocked-users`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ userId })
	});

	return response.json();
};

// Return friendship ID using the usernames of the current user and friend user
export async function getFriendship(currentUserId: string, friendUserId: string) {
    const response = await fetch(`${BASE_URL}/friends/friendship?currentUserId=${currentUserId}&friendUserId=${friendUserId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.json();
};