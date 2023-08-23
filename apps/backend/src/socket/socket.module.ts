import { Module } from '@nestjs/common';
import { SocketEvents } from './socketEvents';
import ChatModule from 'src/chat/chat.module';
import FriendsModule from 'src/friends/friends.module';

@Module({
  providers: [SocketEvents],
  imports: [ChatModule, FriendsModule]
})
export class SocketModule {}
