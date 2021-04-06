import styles from './BelotePage.module.scss'
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react'
import CONSTANTS from './../../modules/CONSTANTS.json'
import { connectToSocket, disconnectFromSocket } from '../../modules/socketActions'
import GameStatusIndicator from './../../components/GameStatusIndicator'
import PremiumIndicator from './../../components/PremiumIndicator'
import Hand from './../../components/Hand'
import GameBoard from './../../components/GameBoard'

function BelotePage(props) {
    const { t } = useTranslation('translations');
    // server conn vars
    const [server, setServer] = useState(CONSTANTS.game_server_addr)
    const [roomID, setRoomID] = useState(props.match.params.roomID)
    const [clientID, setClientID] = useState(uuidv4())
    const [displayName, setDisplayName] = useState(null)
    const [socket, setSocket] = useState(null)
    const [usernameSet, setUsernameSet] = useState(false)
    // game state vars
    const [gameStatus, setGameStatus] = useState(null)
    const [roundStatus, setRoundStatus] = useState(false)
    const [roundScore, setRoundScore] = useState({})
    const [validSuitOptions, setValidSuitOptions] = useState([])
    const [playerHand, setPlayerHand] = useState([])
    const [playerHandValidOptions, setPlayerHandValidOptions] = useState([])

    // manage socket communication
    useEffect(() => {
        if (displayName && usernameSet) {
            let socket_connection = connectToSocket(server, roomID, clientID, displayName);

            socket_connection.on("gameStatusUpdate", (args) => {
                console.log(`Received game status update ${JSON.stringify(args)}`)
                setGameStatus(args)
            });

            socket_connection.on("roundStatusUpdate", (args) => {
                console.log(`Received round status update ${JSON.stringify(args)}`)
                setRoundStatus(args)
            });

            socket_connection.on('playerHandUpdate', (args) => {
                console.log(`Received player hand update ${JSON.stringify(args.cards)}`)
                setPlayerHand(args.cards)
            })

            socket_connection.on('playerValidSuitOptionsUpdate', (args) => {
                console.log(`Received player valid suit options update ${JSON.stringify(args)}`)
                setValidSuitOptions(args)
            })

            socket_connection.on('playerHandValidOptionsUpdate', (args) => {
                console.log(`Received player valid hand options update ${JSON.stringify(args)}`)
                setPlayerHandValidOptions(args)
            })

            socket_connection.on('roundScoreUpdate', (args) => {
                console.log(`Received round score update ${JSON.stringify(args)}`)
                setRoundScore(args)
            })

            setSocket(socket_connection)
        }
    }, [roomID, clientID, displayName, usernameSet]);

    const handleDeckSplit = (index) => {
        socket.emit("splitDeck", index);
    }

    const handleSuitSelect = (suit) => {
        socket.emit("suitSelect", suit);
    }

    const handleCardPlay = (card) => {
        socket.emit("cardPlay", card);
    }

    const handleReadyToConnect = () => {
        setUsernameSet(true);
    }

    return (
        <div className={styles.page} >
            <div className={styles.pageLayout}>
                <div className={styles.first}>
                    Belote Room ID: {roomID}
                    {usernameSet === false &&
                        <div>
                            <form>
                                <input onChange={event => setDisplayName(event.target.value)} />
                                <button onClick={handleReadyToConnect}>Connect</button>
                            </form>
                        </div>
                    }
                    <GameBoard
                        gameStatus={gameStatus}
                        roundStatus={roundStatus}
                        localUsername={displayName}
                        validSuitOptions={validSuitOptions}
                        roundScore={roundScore}
                        handleDeckSplit={handleDeckSplit}
                        handleSuitSelect={handleSuitSelect}
                    />
                    <div className={styles.handContainer}>
                        <Hand
                            showCards={true}
                            vertical={false}
                            cardCount={playerHand.length}
                            cards={playerHand}
                            validOptions={playerHandValidOptions}
                            roundStatus={roundStatus.status}
                            playSelectedCard={handleCardPlay}
                        />
                    </div>
                </div>
                <div>
                    <GameStatusIndicator
                        gameStatus={gameStatus}
                        roundStatus={roundStatus}
                    />
                    <br />
                    <br />
                    <br />
                    <PremiumIndicator premiums={roundStatus.premiums} />
                </div>
            </div>

        </div >
    );
}

export default BelotePage;