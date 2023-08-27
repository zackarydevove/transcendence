import { WebSocketGateway, WebSocketServer, SubscribeMessage, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import ChatService from "src/chat/chat.service";
import FriendsService from "src/friends/friends.service";
import DatabaseService from "src/database/database.service";

@WebSocketGateway({
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    }
})
export class SocketEvents {

    @WebSocketServer()
    server: Server;

    constructor(
		private chatService: ChatService,
		private friendsService: FriendsService
	) {}

	// connect (each client has their own id)
    handleConnection(client: Socket){
        console.log(`client connected: ${client.id}`);
    }

	// disconnect
    handleDisconnect(client: Socket){
        console.log(`client disconnected: ${client.id}`);
    }

	// join chat
    @SubscribeMessage('joinChat')
    async handleJoinChat(client: Socket, payload: { chatId: string, password?: string }) {
		console.log(`Client with ID ${client.id} joining chat ${payload.chatId}`);
        client.join(payload.chatId);
        return { event: 'chatJoined', data: `Joined chat with ID ${payload.chatId}` };
    }

	// kick from chat
    @SubscribeMessage('kickUserFromChat')
    async handleKickChat(client: Socket, payload: { chatId: string, adminUserId: string, targetUserId: string }) {
		const isKicked = await this.chatService.kickUserFromChat(payload.chatId, payload.adminUserId, payload.targetUserId);
		if (isKicked) {
			console.log(`Admin with ID ${payload.adminUserId} has kicked ${payload.targetUserId} from chat ${payload.chatId}`);
			client.to(payload.chatId).emit('userKicked', { kickedUserId: payload.targetUserId, chatId: payload.chatId });
		}
        return { event: 'userKicked', data: `Admin with ID ${payload.adminUserId} has kicked ${payload.targetUserId} from chat ${payload.chatId}` };
    }

	// quit chat
    @SubscribeMessage('quitChat')
    handleQuitChat(client: Socket, chatId: string) {
		console.log(`Client with ID ${client.id} left chat with ID ${chatId}`);
        client.leave(chatId);
        return { event: 'chatQuit', data: `Left chat with ID ${chatId}` };
    }

	// send message
    @SubscribeMessage('sendMessage')
    async handleSendMessage(client: Socket, payload: { chatId: string, senderId: string, content: string }) {
        try {
            const message = await this.chatService.createMessage(payload.chatId, payload.senderId, payload.content);
            this.server.to(payload.chatId).emit('newMessage', message);
			console.log(`message: \n`, message, `has sent to ${payload.chatId} by ${payload.senderId}`);
            return { event: 'messageSent', data: `Message sent to chat with ID ${payload.chatId}` };
        } catch (error) {
            throw new WsException(`Error sending message: ${error.message}`);
        }
    }


	// join chat
    @SubscribeMessage('joinFriendship')
    async handleJoinFriendship(client: Socket, friendshipId: string) {
		console.log(`Client with ID ${client.id} join friendship with ID ${friendshipId}`);
        client.join(friendshipId);
        return { event: 'chatJoined', data: `Joined friendship with ID ${friendshipId}` };
    }

	// quit chat
    @SubscribeMessage('quitFriendship')
    handleQuitFriendship(client: Socket, friendshipId: string) {
		console.log(`Client with ID ${client.id} left friendship with ID ${friendshipId}`);
        client.leave(friendshipId);
        return { event: 'chatQuit', data: `Left chat with ID ${friendshipId}` };
    }

	// send message to friend
	@SubscribeMessage('sendFriendMessage')
	async handleSendFriendMessage(client: Socket, payload: { friendshipId: string, senderId: string, content: string }) {
		try {
			const message = await this.friendsService.sendMessage(payload.friendshipId, payload.senderId, payload.content);
			this.server.to(payload.friendshipId).emit('newFriendMessage', message);
			console.log(`message: \n`, message, `has sent to ${payload.friendshipId} by ${payload.senderId}`);
			return { event: 'friendMessageSent', data: `Message sent to friend's chat with ID ${payload.friendshipId}` };
		} catch (error) {
			throw new WsException(`Error sending message to friend: ${error.message}`);
		}
	}
}
