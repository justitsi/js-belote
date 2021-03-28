const { emit } = require('process');

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

server.listen(process.env.PORT || 8000);

const rooms = [];
const room_limit = 4;

io.on("connection", (socket) => {
    // Join a room
    const room_id = socket.handshake.query.room;
    const client = socket.handshake.query.client;

    // get rooms arr entry
    let room_entry = null
    for (const item of rooms) {
        if (item.id == room_id)
            room_entry = item
    }

    // init room data if needed
    if (!room_entry) {
        const room_data = {
            id: room_id,
            clients: [],
            messages: [],
            connections: []
        }
        rooms.push(room_data);
        room_entry = room_data
    }

    // check if user is already in room
    let isInRoom = false;
    for (const client_entry of room_entry.clients) {
        if (client_entry.id == client) {
            isInRoom = true
            console.log(`${client} already in room ${room_id}`)
        }
    }

    // check if room is not already full
    let isRoomFull = false;
    if (room_entry.clients.length >= room_limit) {
        isRoomFull = true;
        console.log(`Room ${room_id} is full`)
    }

    // update rooms arr entry and join
    if (!isInRoom && !isRoomFull) {
        socket.join(room_id);
        const new_connection = {
            id: client,
        }
        room_entry.clients.push(new_connection);
        console.log(`${client} joined ${room_id}`)
        io.to(room_id).emit(`user ${client} has joined the room`);
    }

    // Leave the room if the user closes the socket
    socket.on("disconnect", () => {
        socket.leave(room_id);
        console.log(`${client} left ${room_id}`)
        for (const client_entry of room_entry.clients) {
            if (client_entry.id == client) {
                const index = room_entry.clients.indexOf(client_entry);
                if (index > -1) {
                    room_entry.clients.splice(index, 1);
                }
            }
        }
        io.to(room_id).emit(`user ${client} has left the room`);

        // delete the room if all users have left
        if (room_entry.clients.length == 0) {
            for (const entry of rooms) {
                if (entry.id == room_id) {
                    const index = rooms.indexOf(entry);
                    if (index > -1) {
                        rooms.splice(index, 1);
                        console.log(`Deleted room ${room_id}`)
                    }
                }
            }
        }

    });

    // console.log(rooms)

    socket.on('getConnectionInfo', (args) => {
        console.log(`Giving out info ${JSON.stringify(room_entry.connections)}`);
        socket.emit('connectionInfo', room_entry.connections)
    });
});