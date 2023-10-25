import { createContext } from 'react';

// export react contexts
export const SocketContext = createContext();
export const GameSocketContext = createContext();

// playerName + setter + gameRoomId + setter 
export const GameSettingsContext = createContext(["", (name) => { }, "", (name) => { }]);
