import { Injectable } from "@nestjs/common";
import DatabaseService from "src/database/database.service";

@Injectable()
export default class FriendsService {
	constructor(private databaseService: DatabaseService) {}

	async getFriends(userId: string) {
		const user = await this.databaseService.user.findUnique({
			where: { id: userId },
			include: {
				initiatedFriendships: {
					select: {
						user2: {
							select: {
								id: true,
								username: true,
								email: true,
								status: true
							}
						}
					}
				},
				acceptedFriendships: {
					select: {
						user1: {
							select: {
								id: true,
								username: true,
								email: true,
								status: true
							}
						}
					}
				}
			}
		});
	
		const initiatedFriends = user?.initiatedFriendships.map(friendship => friendship.user2) || [];
		const acceptedFriends = user?.acceptedFriendships.map(friendship => friendship.user1) || [];
	
		return [...initiatedFriends, ...acceptedFriends];
	}

	async addFriend(userId: string, friendId: string) {
		// Fetch the friend's blocked users
		const friend = await this.databaseService.user.findUnique({
			where: { id: friendId },
			select: {
				blockedFriends: true
			}
		});
	
		// Check if the friend has blocked the user
		if (friend && friend.blockedFriends.includes(userId)) {
			return { blocked: true };
		}
	
		// Check if they are already friends
		const existingFriendship = await this.databaseService.friendship.findFirst({
			where: {
				OR: [
					{ user1Id: userId, user2Id: friendId },
					{ user1Id: friendId, user2Id: userId }
				]
			}
		});
	
		if (existingFriendship) {
			return { already: true };
		}
	
		// If they are not blocked and not already friends, create the friendship
		return this.databaseService.friendship.create({
			data: {
				user1Id: userId,
				user2Id: friendId
			}
		});
	}
	
	async getUser(username: string) {
		const user = await this.databaseService.user.findUnique({
			where: {
				username: username
			}
		});
	
		return user;
	}

	async getUsers() {
        return this.databaseService.user.findMany();
    }

	async deleteFriend(userId: string, friendId: string) {
		const friendship = await this.databaseService.friendship.findFirst({
			where: {
			OR: [
				{ user1Id: userId, user2Id: friendId },
				{ user1Id: friendId, user2Id: userId }
			]
			},
			select: {
				id: true
			}
		});

		if (!friendship) {
			return { error: "Friendship not found"};
		}

		await this.databaseService.friendMessage.deleteMany({
			where: {
				friendshipId: friendship.id
			}
		});

		return this.databaseService.friendship.delete({
			where: {
				id: friendship.id
			}
		});
	}

	async blockUser(userId: string, blockedId: string) {
		await this.deleteFriend(userId, blockedId);

		return this.databaseService.user.update({
			where: { id: userId },
			data: {
				blockedFriends: {
					push: blockedId
				}
			}
		});
	}

	async unblockUser(userId: string, blockedId: string) {
		const user = await this.databaseService.user.findUnique({
			where: { id: userId }
		});
		const updatedBlockedUsers = (user?.blockedFriends || []).filter(id => id !== blockedId); 

		return this.databaseService.user.update({
			where: { id: userId },
			data: {
				blockedFriends: {
					set: updatedBlockedUsers
				}
			}
		});
	}

	async getBlockedUsers(userId: string) {
		const user = await this.databaseService.user.findUnique({
			where: { id: userId },
			select: {
				blockedFriends: true
			}
		});
		
		return user?.blockedFriends || [];
	}

	async sendMessage(friendshipId: string, senderId: string, content: string) {
		const exist = await this.databaseService.friendship.findUnique({
			where: { id: friendshipId },
			select: { id: true }
		});

		if (!exist) {
			return { ok: false };
		}
	
		return this.databaseService.friendMessage.create({
			data: {
				content: content,
				senderId: senderId,
				friendshipId: friendshipId
			},
			include: {
				sender: true
			}
		});
	}

	async getFriendshipMessages(friendshipId: string) {
		return await this.databaseService.friendMessage.findMany({
			where: { friendshipId: friendshipId },
			orderBy: {
				createdAt: 'asc'
			},
			include: {
				sender: true
			}
		});
	}

	async getFriendship(currentUserId: string, friendUserId: string) {
		const friendship = await this.databaseService.friendship.findFirst({
			where: {
				OR: [
					{
						user1Id: currentUserId,
						user2Id: friendUserId
					},
					{
						user1Id: friendUserId,
						user2Id: currentUserId
					}
				]
			}
		});
	
		return friendship ? friendship : { exist: false };
	}

	async getFriendshipFromId(friendshipId: string) {
		const friendship = await this.databaseService.friendship.findFirst({
			where: {
				id: friendshipId
			}
		});
	
		return friendship ? { exist: true } : { exist: false };
	}

	async updateUserStatus(userId: string, status: 'online' | 'offline' | 'ingame') {
		const user = await this.databaseService.user.update({
				where: { id: userId },
				data: { status },
			});
		if (!user)
			return { error: 'Error updating user status:', ok: false};
		return { user, ok: true };
	}
}
