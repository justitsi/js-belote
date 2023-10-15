import { io } from 'socket.io-client';
import CONSTANTS from './CONSTANTS.json';

export const connectToGameSocket = (room, client, displayName) => {
    const socket = io(
        CONSTANTS.game_server_addr,
        {
            query: {
                "action": "connectToGame",
                "room": room,
                "client": client,
                "displayName": displayName
            }
        });
    socket.connect();

    return socket;
}

export const connectToServerSocket = (clientID) => {
    const socket = io(
        CONSTANTS.game_server_addr,
        {
            query: {
                "action": "connectToServer",
                "client": clientID
            }
        }
    );
    socket.connect();

    return socket;
}


export const disconnectFromSocket = (socket) => {
    socket.disconnect();
    return socket;
}

