import { io } from 'socket.io-client';

const socket = io("http://localhost:8080", {
    withCredentials: true, // Ensure this if you plan to use cookies
});

export default socket;