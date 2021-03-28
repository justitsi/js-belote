import { io } from 'socket.io-client';

export const connectToSocket = (server, room, client) => {
    console.log(`connecting to ${server}`);
    let socket = io(server, { query: { "room": room, "client": client } });
    socket.connect();

    return socket;
}

export const disconnectFromSocket = (socket) => {
    socket.disconnect();
    return socket;
}

