import { io } from 'socket.io-client';
import createUrl from './createUrl';

const socket = io("http://localhost:8080", {
    withCredentials: true,
});

export default socket;