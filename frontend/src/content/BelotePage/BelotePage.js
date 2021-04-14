import styles from './BelotePage.module.scss'
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react'
import { connectToGameSocket, disconnectFromSocket } from '../../modules/socketActions'
import GameStatusIndicator from './../../components/GameComponents//GameStatusIndicator'
import PremiumIndicator from './../../components/GameComponents//PremiumIndicator'
import Hand from './../../components/GameComponents//Hand'
import GameBoard from '../../components/GameComponents/GameBoard'
import RoomChat from '../../components/GameComponents/RoomChat'
import HandHistory from './../../components/GameComponents/HandHistory'
import PremiumOptions from './../../components/GameComponents/PremiumOptions'
import GameUsernamePrompt from './../../components/SiteComponents/GameUsernamePrompt'
import { sortCards } from './../../modules/GameFunctions'
import { Row, Col, Container } from 'react-bootstrap'

function BelotePage(props) {
    const { t } = useTranslation('translations');
    // window rendering vars
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    // server conn vars
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
    const [lobbyEvents, setLobbyEvents] = useState([])
    const [premiumOptions, setPremiumOptions] = useState({ 'C': [], 'S': [] })
    const [suitSelectionHistory, setSuitSelectionHistory] = useState([])

    // manage socket communication
    useEffect(() => {
        if (displayName && usernameSet) {
            if (socket) disconnectFromSocket(socket);
            let socket_connection = connectToGameSocket(roomID, clientID, displayName);

            socket_connection.on("gameStatusUpdate", (args) => {
                console.log(`Received game status update ${JSON.stringify(args)}`)
                setGameStatus(args)
            });

            socket_connection.on("roundStatusUpdate", (args) => {
                console.log(`Received round status update ${JSON.stringify(args)}`)
                // reset suit selections if new selection has sterted - suit would be undefined
                if (args.suitInfo.suit === null && args.suitInfo.modifier === 1) setSuitSelectionHistory([])
                if (args.status !== 'started_selecting_suit') setSuitSelectionHistory([])
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

            socket_connection.on('lobbyUpdate', (args) => {
                console.log(`Receivedlobby update ${JSON.stringify(args)}`)
                const events = lobbyEvents
                events.push(args)
                setLobbyEvents(events)
            })

            socket_connection.on('playerPremiumValidOptions', (args) => {
                console.log(`Received player valid premium options update ${JSON.stringify(args)}`)
                setPremiumOptions(args)
            })

            socket_connection.on('suitSelectionUpdate', (args) => {
                console.log(`Received suit selection update ${JSON.stringify(args)}`)
                const selections = suitSelectionHistory
                selections.push(args)
                setSuitSelectionHistory(selections)
            })

            setSocket(socket_connection)
        }

        return () => {
            if (socket) disconnectFromSocket(socket);
            if (usernameSet) setUsernameSet(false)
        }
    }, [roomID, clientID, displayName, usernameSet]);

    useEffect(() => {
        if (socket) disconnectFromSocket(socket);
        setSocket(null)
        setUsernameSet(false)
        setDisplayName(null)
        setRoomID(props.match.params.roomID)
    }, [props.match.params.roomID])



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

    const handleAnouncePremiums = (premiums) => {
        socket.emit("anouncePremium", premiums);
    }

    // refresh window width on resize
    window.addEventListener("resize", () => { setWindowWidth(window.innerWidth) });

    return (
        < div className={styles.page} >
            {socket &&
                <div>
                    <Row>
                        <Col>
                            Window Width: {windowWidth}
                        </Col>
                    </Row>
                    <Row fluid='md'>
                        <Col sm={0} md={0} lg={1} xl={1} />
                        <Col lg={9} xl={10}>
                            <div className={styles.gameBoardAndIndicatorsContainer}>
                                <div className={styles.gameBoardAndHandContainer}>
                                    <GameBoard
                                        gameStatus={gameStatus}
                                        roundStatus={roundStatus}
                                        localUsername={displayName}
                                        validSuitOptions={validSuitOptions}
                                        suitSelectionHistory={suitSelectionHistory}
                                        roundScore={roundScore}
                                        handleDeckSplit={handleDeckSplit}
                                        handleSuitSelect={handleSuitSelect}
                                    />
                                    <div>
                                        <div className={styles.gameBoardWidthMatcherForHand}>
                                            <div />
                                            <div className={styles.handContainer}>
                                                <PremiumOptions
                                                    roundStatus={roundStatus}
                                                    displayName={displayName}
                                                    availablePremiums={premiumOptions}
                                                    handleAnouncePremiums={handleAnouncePremiums}
                                                />
                                                <Hand
                                                    showCards={true}
                                                    vertical={false}
                                                    cardCount={playerHand.length}
                                                    cards={sortCards(playerHand, roundStatus)}
                                                    validOptions={playerHandValidOptions}
                                                    roundStatus={roundStatus.status}
                                                    playSelectedCard={handleCardPlay}
                                                />
                                            </div>
                                            <div />
                                        </div>
                                    </div>
                                </div>
                                {windowWidth > 1280 &&
                                    <div className={styles.indicatorsContainer}>
                                        <PremiumIndicator
                                            premiums={roundStatus.premiums}
                                        />
                                        {lobbyEvents.length > 0 &&
                                            <RoomChat events={lobbyEvents} />
                                        }

                                        <GameStatusIndicator
                                            gameStatus={gameStatus}
                                            roundStatus={roundStatus}
                                        />
                                        <HandHistory
                                            roundStatus={roundStatus}
                                        />


                                    </div>
                                }
                            </div>
                        </Col>
                        <Col sm={0} md={0} lg={1} xl={1} />
                    </Row>
                    <Row>
                        {/* <Col>
                    <div>
                        <GameStatusIndicator
                            gameStatus={gameStatus}
                            roundStatus={roundStatus}
                        />
                        <PremiumIndicator
                            premiums={roundStatus.premiums}
                        />
                        {lobbyEvents.length > 0 &&
                            <RoomChat events={lobbyEvents} />
                        }
                    </div>
                </Col> */}
                    </Row>
                </div>
            }
            {usernameSet === false && !socket &&
                <div className={styles.nameEntryFormContainer}>
                    <GameUsernamePrompt
                        roomID={roomID}
                        setDisplayName={setDisplayName}
                        handleReadyToConnect={handleReadyToConnect}
                    />
                </div>
            }
        </div >
    );
}

export default BelotePage;