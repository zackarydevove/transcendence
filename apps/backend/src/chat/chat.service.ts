import { Injectable } from "@nestjs/common";
import { ChatType, UserRole } from "@prisma/client";
import DatabaseService from "src/database/database.service";

@Injectable()
export default class ChatService {
	constructor(private databaseService: DatabaseService) {}

	// create chat
	async createChat(type: ChatType, name: string, userId: string, password?: string) {

		const newChat = {
			name,
			type,
			password,
			members: {
				create: {
					userId: userId,
					role: UserRole.creator
				}
			}
		};

		const chat = await this.databaseService.chat.create({ data: newChat });
		return chat;
	}

	// Get all the chat where user is a member of 
	async getUserChats(userId: string) {
		const userChats = await this.databaseService.member.findMany({
			where: {
				userId: userId
			},
				include: {
				chat: true
			}
		});

		return userChats.map((uc: any) => uc.chat);
	}

	// Get all chats (public, private or protected) and not already a member of
	async getChats(userId: string) {
		// First, get all chat IDs where the user is a member
		const userChats = await this.databaseService.member.findMany({
			where: {
				userId: userId
			},
			select: {
				chatId: true
			}
		});
	
		const userChatIds = userChats.map((uc: any) => uc.chatId);
	
		// Then, get all chats that the user is a member of
		const chats = await this.databaseService.chat.findMany({
			where: {
				id: {
					in: userChatIds
				}
			}
		});
	
		return chats;
	}

	// Fetch all chats from the database
	async getAllChats(userId: string) {
		const chats = await this.databaseService.chat.findMany();
		return chats;
	}

	// get a specific chat
	async getChat(chatId: string) {
		const chat = await this.databaseService.chat.findUnique({
		where: { id: chatId },
		include: {
			members: true,
			messages: true
		}
		});

		if (!chat) {
			throw new Error('Chat not found');
		}

		return chat;
	}

	// Add a user to the channel
	async addMember(chatId: string, userId: string) {
		const chat = await this.databaseService.chat.findUnique({ where: { id: chatId } });
		const user = await this.databaseService.user.findUnique({ where: { id: userId } });

		if (!chat) throw new Error('Chat not found');
		if (!user) throw new Error('User not found');

		// Check if the user is banned
    	if (chat.banned.includes(userId)) {
	        throw new Error('This user is banned from the chat.');
    	}

		const newMember = await this.databaseService.member.create({
		data: {
			userId: userId,
			chatId: chatId,
			role: 'member'  // Default role when adding a new member
		}
		});

		// Add the newMember to the members array of the Chat
		await this.databaseService.chat.update({
			where: { id: chatId },
			data: {
			members: {
				connect: { id: newMember.id }
			}
			}
		});

		return newMember;
	}

	// Remove a user from the channel
	async deleteMember(chatId: string, userId: string) {
		const member = await this.databaseService.member.findFirst({
			where: {
				userId: userId,
				chatId: chatId
			}
		});

		if (!member) {
			throw new Error('Member not found in the chat');
		}

		// Check the number of members in the chat
		const memberCount = await this.databaseService.member.count({
			where: {
				chatId: chatId
			}
		});

		// If this is the last member, delete the chat
		if (memberCount === 1) {
			return await this.deleteChat(chatId, userId)
		}

		// Else, just delete the member
		const deletedMember = await this.databaseService.member.delete({
			where: {
				id: member.id
			}
		});

		return deletedMember;
	}

	// Delete the chat
	async deleteChat(chatId: string, userId: string) {
		const chat = await this.databaseService.chat.findUnique({ where: { id: chatId } });
	
		if (!chat) throw new Error('Chat not found');
	
		// Check user's role for the chat
		const member = await this.databaseService.member.findFirst({
			where: {
				chatId: chatId,
				userId: userId
			}
		});
	
		if (!member) throw new Error('User is not a member of this chat');
	

		const memberCount = await this.databaseService.member.count({
			where: {
				chatId: chatId
			}
		});

		if (memberCount > 1 && member.role !== UserRole.creator && member.role !== UserRole.admin) {
			throw new Error('Only the creator or admin can delete the chat');
		}

		await this.databaseService.member.deleteMany({
			where: {
				chatId: chatId
			}
		});

		await this.databaseService.message.deleteMany({
			where: {
				chatId: chatId
			}
		});
	
		await this.databaseService.invite.deleteMany({
			where: {
				chatId: chatId
			}
		});
	
		const deletedChat = await this.databaseService.chat.delete({
			where: {
				id: chatId
			}
		});
	
		return { message: 'Chat successfully deleted' };
	}

	// send message in chat
	async createMessage(chatId: string, userId: string, content: string) {
		const chat = await this.databaseService.chat.findUnique({ where: { id: chatId } });
		const user = await this.databaseService.user.findUnique({ where: { id: userId } });
	
		if (!chat) throw new Error('Chat not found');
		if (!user) throw new Error('User not found');
	
		const newMessage = await this.databaseService.message.create({
		data: {
			content: content,
			chatId: chatId,
			senderId: userId
		},
		include: {
			sender: true
		}
		});
	
		return newMessage;
	}

	// get all the messages of this chat from the most recent
	async getMessages(chatId: string) {
		return await this.databaseService.message.findMany({
			where: { chatId: chatId },
			orderBy: {
				createdAt: 'asc'
			},
			include: {
				sender: true
			}
		});
	}

	// Get all the members of the chat (for the setting UI)
	async getMembers(chatId: string) {
		const members = await this.databaseService.member.findMany({
		where: {
			chatId: chatId,
		},
		include: {
			user: true
		}
		});
	
		return members;
	}

	// change name of channel
	async updateChatName(chatId: string, newChatName: string) {
		const chat = await this.databaseService.chat.findUnique({ where: { id: chatId } });
		
		if (!chat) throw new Error('Chat not found');
		
		const updatedChat = await this.databaseService.chat.update({
			where: { id: chatId },
			data: { name: newChatName }
		});
		
		return updatedChat;
	}

	// change password of channel
	async updateChatPassword(chatId: string, newPassword: string) {
		const chat = await this.databaseService.chat.findUnique({ where: { id: chatId } });
	
		if (!chat) throw new Error('Chat not found');
	
		const updatedChat = await this.databaseService.chat.update({
			where: { id: chatId },
			data: { password: newPassword }
		});
	
		return updatedChat;
	}

	// ban user from chat
	async banUserFromChat(chatId: string, adminUserId: string, targetUserId: string) {
		
		const getAdmin = await this.databaseService.member.findFirst({
			where: {
				userId: adminUserId,
				chatId: chatId
			},
			select: {
				id: true,
			}
		});

		if (!getAdmin)
			throw new Error('User is not a member of the chat');

		// Check if adminUserId is either creator or admin
		const checkAdmin = await this.databaseService.member.findUnique({
			where: {
				id: getAdmin.id
			},
			select: {
				role: true
			}
		});
	
		if (!checkAdmin || (checkAdmin.role !== 'admin' && checkAdmin.role !== 'creator')) {
			throw new Error('Only admin or creator can ban users.');
		}
	
		// Get the chat
		const chatToUpdate = await this.databaseService.chat.findUnique({
			where: {
				id: chatId
			}
		});
	
		if (!chatToUpdate) throw new Error('Chat not found');
	
		// Remove target from the chat
		const user = await this.deleteMember(chatId, targetUserId);

		// Add user in the banned list
		const updatedChat = await this.databaseService.chat.update({
			where: {
				id: chatId
			},
			data: {
				banned: {
				push: targetUserId
				}
			}
		});
	
		return updatedChat;
	}

	// Kick user from chat
	async kickUserFromChat(chatId: string, adminUserId: string, targetUserId: string) {

		// Check if adminUserId is either creator or admin
		const checkAdmin = await this.databaseService.member.findFirst({
			where: {
				userId: adminUserId,
				chatId: chatId
			},
			select: {
				role: true
			}
		});
	
		if (!checkAdmin || (checkAdmin.role !== 'admin' && checkAdmin.role !== 'creator')) {
			throw new Error('Only admin or creator can kick users.');
		}
  
		return this.deleteMember(chatId, targetUserId);
	}

	// Invite user: add user to the invited list
	async inviteUserToChat(chatId: string, inviterUserId: string, targetUser: string) {

		// Check if targetUser is already a member of the chat
		const isMember = await this.databaseService.member.findFirst({
			where: {
				userId: targetUser,
				chatId: chatId
			}
		});
	
		if (isMember) {
			throw new Error('The target user is already a member of this chat.');
		}
	
		// Check if the user is already invited
		const isInvited = await this.databaseService.invite.findFirst({
		where: {
			userId: targetUser,
			chatId: chatId
		}
		});
	
		if (isInvited) {
			throw new Error('The target user is already invited to this chat.');
		}
	
		// Otherwise, add the user to the invite table
		const inviteRecord = await this.databaseService.invite.create({
		data: {
			userId: targetUser,
			chatId: chatId,
		}
		});
	
		return inviteRecord;
	}

	async muteMember(chatId: string, adminUserId: string, targetUserId: string, muteDuration: number) {

		// Check if adminUserId is either creator or admin
		const memberRole = await this.databaseService.member.findFirst({
			where: {
				userId: adminUserId,
				chatId: chatId
			},
			select: {
				role: true
			}
		});

		if (!memberRole || (memberRole.role !== 'admin' && memberRole.role !== 'creator')) {
			throw new Error('Only admin or creator can mute users.');
		}

		// Calculate mute end time
		const mutedUntil = new Date();
		mutedUntil.setMinutes(mutedUntil.getMinutes() + muteDuration);

		const targetMember = await this.databaseService.member.findFirst({
			where: {
				userId: targetUserId,
				chatId: chatId
			},
			select: {
				id: true
			}
		});
		
		if (!targetMember) {
			throw new Error('The target user is not a member of this chat.');
		}

		// Mute the target member
		const mutedMember = await this.databaseService.member.update({
			where: {
				id: targetMember.id
			},
			data: {
				mutedUntil: mutedUntil
			}
		});

		return mutedMember;
	}

	async isMuted(chatId: string, userId: string) {
		const member = await this.databaseService.member.findFirst({
			where: {
				userId: userId,
				chatId: chatId
			},
			select: {
				mutedUntil: true
			}
		});
	  
		if (!member) {
			throw new Error('User is not a member of this chat.');
		}
	  
		if (member.mutedUntil && member.mutedUntil > new Date()) {
			const now = new Date();
			const timeDiff = Math.abs(member.mutedUntil.getTime() - now.getTime());
			const diffMinutes = Math.ceil(timeDiff / (1000 * 60));
			return { isMuted: true, remainingMinutes: diffMinutes };
		} else {
			return { isMuted: false };
		}
	}

	async unmuteMember(chatId: string, adminUserId: string, targetUserId: string) {

		// Check if adminUserId is either creator or admin
		const memberRole = await this.databaseService.member.findFirst({
			where: {
				userId: adminUserId,
				chatId: chatId
			},
			select: {
				role: true
			}
		});
	  
		if (!memberRole || (memberRole.role !== 'admin' && memberRole.role !== 'creator')) {
		  	throw new Error('Only admin or creator can unmute users.');
		}

		// Check if the target user is actually muted
		const targetMember = await this.databaseService.member.findFirst({
			where: {
				userId: targetUserId,
				chatId: chatId
			},
			select: {
				id: true,
				mutedUntil: true
			}
		});
	  
		if (!targetMember) {
		  	throw new Error('The target user is not a member of this chat.');
		}
	  
		if (!targetMember.mutedUntil || targetMember.mutedUntil <= new Date()) {
		  	throw new Error('The target user is not muted.');
		}
	  
		// Unmute the target member by setting the mutedUntil field to null
		const unmutedMember = await this.databaseService.member.update({
			where: {
				id: targetMember.id
			},
			data: {
				mutedUntil: null
			}
		});
	  
		return unmutedMember;
	}
}