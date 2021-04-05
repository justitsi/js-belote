const { emit } = require('process');
const Game = require('./modules/gameObjects')

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

server.listen(process.env.PORT || 8000);

const rooms = [];
const room_limit = 4;

io.on("connection", async (socket) => {
    getRoomEntry(socket).then((room_entry) => {
        const room_id = socket.handshake.query.room;
        const client_id = socket.handshake.query.client;
        const displayName = socket.handshake.query.displayName;


        // Leave the room if the user closes the socket
        socket.on("disconnect", () => {
            socket.leave(room_id);
            console.log(`${client_id} left ${room_id}`)
            for (const client_entry of room_entry.clients) {
                if (client_entry.id == client_id) {
                    const index = room_entry.clients.indexOf(client_entry);
                    if (index > -1) {
                        room_entry.clients.splice(index, 1);
                    }
                }
            }
            io.to(room_id).emit(`user ${client_id} has left the room`);

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

        socket.on('splitDeck', (args) => {
            console.log(`Getting command to split deck: ${args} from ${displayName} (${client_id})`);
            const splitRes = room_entry.gameInstance.currentRound.splitDeck(displayName, args)
            console.log(splitRes)
            if (splitRes) {
                sendToAllPlayersInRoom(room_entry, 'roundStatusUpdate', room_entry.gameInstance.currentRound.getRoundStatus())
                sendMoveOptionsToPlayers(room_entry)
            }
        });

        socket.on('suitSelect', (args) => {
            console.log(`Getting command to select suit: ${args} from ${displayName} (${client_id})`);


            let suitRes = false;
            if (args === 'x2' || args === 'x4') {
                currentSuit = room_entry.gameInstance.currentRound.suit;
                suitRes = room_entry.gameInstance.currentRound.callSuit(displayName, currentSuit, args.charAt(1))
            }
            else {
                suitRes = room_entry.gameInstance.currentRound.callSuit(displayName, args, 1)
            }

            if (suitRes) {
                let roundStatus = room_entry.gameInstance.currentRound.getRoundStatus()

                if (room_entry.gameInstance.currentRound.getRoundStatus().status == 'suit_selected') {
                    room_entry.gameInstance.currentRound.initPlayStage()
                    roundStatus = room_entry.gameInstance.currentRound.getRoundStatus()
                }

                sendToAllPlayersInRoom(room_entry, 'roundStatusUpdate', roundStatus)
                sendMoveOptionsToPlayers(room_entry)
            }
        });

        socket.on('cardPlay', async (args) => {
            console.log(`Getting command to play card: ${JSON.stringify(args)} from ${displayName} (${client_id})`);

            //create a copy of the round state in case 4 cards are placed and game needs to pause
            const startingRoundState = JSON.parse(JSON.stringify(await room_entry.gameInstance.currentRound.getRoundStatus()));

            if (room_entry.gameInstance.currentRound.placeCard(displayName, args.suit, args.rank)) {
                // pause for 2 secs if there's 4 cards on the table so players can see them
                if (startingRoundState.cardsOnTable.length === 3) {
                    await delayCollectingCards(startingRoundState, args, displayName, room_entry)
                }


                sendMoveOptionsToPlayers(room_entry)
                sendToAllPlayersInRoom(room_entry, 'roundStatusUpdate', room_entry.gameInstance.currentRound.getRoundStatus())

                if (room_entry.gameInstance.currentRound.getRoundStatus().status === 'over') {
                    sendToAllPlayersInRoom(room_entry, 'roundScoreUpdate', room_entry.gameInstance.currentRound.getRoundResults())
                    //sleep for 10 secs before starting new round
                    await new Promise(resolve => setTimeout(resolve, 10000));
                    room_entry.gameInstance.endCurrentRound()
                    sendMoveOptionsToPlayers(room_entry)
                    sendToAllPlayersInRoom(room_entry, 'roundStatusUpdate', room_entry.gameInstance.currentRound.getRoundStatus())
                    sendToAllPlayersInRoom(room_entry, 'gameStatusUpdate', room_entry.gameInstance.getGameInfo())
                }
            }
        });
    })
});

const delayCollectingCards = async (startingRoundState, args, displayName, room_entry) => {
    if (startingRoundState.cardsOnTable.length == 3) {
        startingRoundState.cardsOnTable.push({
            "suit": args.suit,
            "rank": args.rank,
            "placedBy": displayName
        })
        sendToAllPlayersInRoom(room_entry, 'roundStatusUpdate', startingRoundState)
        //sleep for 1.5 secs before hiding the cards
        await new Promise(resolve => setTimeout(resolve, 1500));
    }
}

const sendMoveOptionsToPlayers = (room) => {
    for (const player of room.clients) {
        io.to(player.id).emit('playerHandUpdate', room.gameInstance.currentRound.getPlayerHand(player.displayName));
        io.to(player.id).emit('playerValidSuitOptionsUpdate', room.gameInstance.currentRound.getValidPlayerSuitCalls(player.displayName));

        if (room.gameInstance.currentRound.getRoundStatus().pTurnName === player.displayName)
            io.to(player.id).emit('playerHandValidOptionsUpdate', room.gameInstance.currentRound.getPlayerOptions(player.displayName));
        else io.to(player.id).emit('playerHandValidOptionsUpdate', []);
    }
}

const sendToAllPlayersInRoom = (room, evntType, data) => {
    for (const player of room.clients) {
        io.to(player.id).emit(evntType, data)
    }
}

const getRoomEntry = async (socket) => {
    // Join a room
    const room_id = socket.handshake.query.room;
    const client_id = socket.handshake.query.client;
    const displayName = socket.handshake.query.displayName;

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
            gameInstance: null,
            messages: [],
        }
        rooms.push(room_data);
        room_entry = room_data
    }

    // check if user is already in room
    let isInRoom = false;
    for (const client_entry of room_entry.clients) {
        if (client_entry.id == client_id) {
            isInRoom = true
            // console.log(`${client} already in room ${room_id}`)
        }
    }

    // check if room is not already full
    let isRoomFull = false;
    if (room_entry.clients.length >= room_limit) {
        isRoomFull = true;
        console.log(`Room ${room_id} is full`)
    }

    // update rooms arr entry and join
    // init game object for room if enough players are there
    // todo fix game initialization to actually work with 4 people
    if (!isInRoom && !isRoomFull) {
        socket.join(client_id);
        const new_connection = {
            id: client_id,
            displayName: displayName
        }
        room_entry.clients.push(new_connection);
        console.log(`client ${client_id} with username ${displayName} has joined room ${room_id}`);

        sendToAllPlayersInRoom(room_entry, 'lobbyUpdate', `client ${client_id} with username ${displayName} has joined room ${room_id}`)

        //create new game if room has 4 people in it

        console.log(room_entry.clients)
        room_entry.gameInstance = new Game([
            room_entry.clients[0] ? room_entry.clients[0].displayName : null,
            room_entry.clients[1] ? room_entry.clients[1].displayName : null,
            room_entry.clients[2] ? room_entry.clients[2].displayName : null,
            room_entry.clients[3] ? room_entry.clients[3].displayName : null,
        ]);
        sendToAllPlayersInRoom(room_entry, 'gameStatusUpdate', room_entry.gameInstance.getGameInfo())

        if (room_entry.gameInstance.getGameInfo().teamsValid == true) {
            sendToAllPlayersInRoom(room_entry, 'roundStatusUpdate', room_entry.gameInstance.currentRound.getRoundStatus())
        }
    }

    return (room_entry);
}