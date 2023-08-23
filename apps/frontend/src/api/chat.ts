import socket from "../../socket";
import { ChatType } from "@interface/Interface";

const BASE_URL = process.env.BACKEND_URL || "http://localhost:8080";  // adjust the default URL accordingly

// Creates a new chat with the given type, name, and (optional) password.
export async function createChat(type: ChatType, name: string, userId: string, password?: string,) {
	const response = await fetch(`${BASE_URL}/chat/create`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ type, name, password, userId }),
	});
	return response.json();
}

// Retrieves the details of a specific chat by its ID.
export async function getChat(chatId: string) {
	const response = await fetch(`${BASE_URL}/chat/${chatId}`);
	return response.json();
}

// Adds a user/member to a specific chat.
export async function addMember(chatId: string, userId: string) {
	const response = await fetch(`${BASE_URL}/chat/${chatId}/member`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ userId }),
	});
	return response.json();
}

// Removes a user/member from a specific chat.
export async function deleteMember(chatId: string, userId: string) {
	const response = await fetch(`${BASE_URL}/chat/${chatId}/member`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
        body: JSON.stringify({
            userId: userId
        })
	});
	return response.json();
}

// Deletes a chat by its ID.
export async function deleteChat(chatId: string, userId: string) {
    const response = await fetch(`${BASE_URL}/chat/${chatId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: userId
        })
    });
    return response.json();
}

// Sends a message in a specific chat.
export async function sendMessage(chatId: string, senderId: string, content: string) {
    if (chatId == undefined) return;

    socket.emit('sendMessage', {
		chatId,
		senderId,
		content,
    });
}

// Updates the name of a chat.
export async function updateChatName(chatId: string, newChatName: string) {
	const response = await fetch(`${BASE_URL}/chat/${chatId}/name`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ newChatName }),
	});
	return response.json();
}

// Updates the password of a chat.
export async function updateChatPassword(chatId: string, newPassword: string) {
	const response = await fetch(`${BASE_URL}/chat/${chatId}/password`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ newPassword }),
	});
	return response.json();
}

// Bans a user from a specific chat.
export async function banUser(chatId: string, adminUserId: string, targetUserId: string) {
	const response = await fetch(`${BASE_URL}/chat/${chatId}/ban/${targetUserId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ adminUserId }),
	});
	return response.json();
}

// Fetches all chats that a user is a part of.
export async function getUserChats(userId: string) {
	const response = await fetch(`${BASE_URL}/chat/${userId}/get-chats`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		}
	});
	return response.json();
}

// Fetches all chats that a user is NOT a part of.
export async function getAllChats(userId: string) {
	try {
		const response = await fetch(`${BASE_URL}/chat/all/${userId}`, {
		   method: 'GET',
		   headers: {
			  'Content-Type': 'application/json',
		   }
		});
		if (!response.ok) {
		   throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return response.json();
	 } catch (error) {
		console.error("Error fetching all chats:", error);
		return [];
	 }
}

// Fetches all messages from a specific chat.
export async function getChatMessages(chatId: string) {
	const response = await fetch(`${BASE_URL}/chat/${chatId}/messages`);
	return response.json();
}

// Fetches all members of a specific chat.
export async function getChatMembers(chatId: string) {
	const response = await fetch(`${BASE_URL}/chat/${chatId}/members`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		}
	});
	return response.json();
}

// Kicks a user out of a specific chat.
export async function kickUserFromChat(chatId: string, adminUserId: string, targetUserId: string) {
	const response = await fetch(`${BASE_URL}/chat/${chatId}/kick/${targetUserId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ adminUserId }),
	});
	return response.json();
}

// Invites a user to a chat.
export async function inviteUserToChat(chatId: string, inviterUserId: string, targetUserId: string) {
	const response = await fetch(`${BASE_URL}/chat/${chatId}/invite/${targetUserId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ inviterUserId }),
	});
	return response.json();
}

// Mutes a member in a chat for a specific duration.
export async function muteMember(chatId: string, adminUserId: string, targetUserId: string, muteDuration: number) {
	const response = await fetch(`${BASE_URL}/chat/${chatId}/mute/${targetUserId}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ adminUserId, muteDuration }),
	});
	return response.json();
}

// Checks if a member is muted in a chat.
export async function isMuted(chatId: string, userId: string) {
	const response = await fetch(`${BASE_URL}/chat/${chatId}/is-muted/${userId}`);
	return response.json();
}

// Unmutes a member in a chat.
export async function unmuteMember(chatId: string, adminUserId: string, targetUserId: string) {
	const response = await fetch(`${BASE_URL}/chat/${chatId}/unmute/${targetUserId}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ adminUserId }),
	});
	return response.json();
}