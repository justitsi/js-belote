import styles from './BelotePage.module.scss';
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { log } from "../../modules/util";
import { connectToGameSocket, disconnectFromSocket } from '../../modules/socketActions';
import GameStatusIndicator from './../../components/GameComponents//GameStatusIndicator';
import PremiumIndicator from './../../components/GameComponents//PremiumIndicator';
import Hand from './../../components/GameComponents//Hand';
import GameBoard from '../../components/GameComponents/GameBoard';
import RoomChat from '../../components/GameComponents/RoomChat';
import HandHistory from './../../components/GameComponents/HandHistory';
import PremiumOptions from './../../components/GameComponents/PremiumOptions';

import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import { GameSocketContext, GameSettingsContext } from '../../modules/socketContexts';

const BelotePage = () => {
    // get application context
    const [displayName, setDisplayName, roomID, setRoomID] = useContext(GameSettingsContext);
    const [gameSocketID] = useContext(GameSocketContext);
    // get navigation hook
    const navigate = useNavigate();
    const { urlRoomId } = useParams();
    // window rendering vars
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    // server conn vars
    const [socket, setSocket] = useState(null)
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
    const [selectedPremiums, setSelectedPremiums] = useState([])

    // manage socket communication
    useEffect(() => {
        const roomNameAvailable = ((roomID.length > 0) || (urlRoomId))
        if (!roomID.length > 0) {
            if (urlRoomId) {
                setRoomID(urlRoomId);
            }
        }
        if (displayName && roomNameAvailable) {
            if (roomID) {
                if (socket) disconnectFromSocket(socket);
                let socket_connection = connectToGameSocket(roomID, gameSocketID, displayName);

                socket_connection.on("gameStatusUpdate", (args) => {
                    log("debug", `Received game status update ${JSON.stringify(args)}`)
                    setGameStatus(args)
                });

                socket_connection.on("roundStatusUpdate", (args) => {
                    log("debug", `Received round status update ${JSON.stringify(args)}`)
                    setRoundStatus(args)
                });

                socket_connection.on('playerHandUpdate', (args) => {
                    log("debug", `Received player hand update ${JSON.stringify(args.cards)}`)
                    setPlayerHand(args.cards)
                })

                socket_connection.on('playerValidSuitOptionsUpdate', (args) => {
                    log("debug", `Received player valid suit options update ${JSON.stringify(args)}`)
                    setValidSuitOptions(args)
                })

                socket_connection.on('playerHandValidOptionsUpdate', (args) => {
                    log("debug", `Received player valid hand options update ${JSON.stringify(args)}`)
                    setPlayerHandValidOptions(args)
                })

                socket_connection.on('roundScoreUpdate', (args) => {
                    log("debug", `Received round score update ${JSON.stringify(args)}`)
                    setRoundScore(args)
                })

                socket_connection.on('lobbyUpdate', (args) => {
                    log("debug", `Receivedlobby update ${JSON.stringify(args)}`)
                    const events = lobbyEvents
                    events.push(args)
                    setLobbyEvents(events)
                })

                socket_connection.on('playerPremiumValidOptions', (args) => {
                    log("debug", `Received player valid premium options update ${JSON.stringify(args)}`)
                    setPremiumOptions(args)
                    // args need to be reformated in order to create a *valid* list of all premiums
                    if (args) {
                        const validPremiums = []
                        for (const premiumCards of args.C) {
                            const validPremium = {
                                cards: premiumCards,
                                type: 'C'
                            }
                            validPremiums.push(validPremium)
                        }
                        for (const premiumCards of args.S) {
                            const validPremium = {
                                cards: premiumCards,
                                type: 'S'
                            }
                            validPremiums.push(validPremium)
                        }
                        setSelectedPremiums(validPremiums)
                    }
                    else setSelectedPremiums([])
                })


                socket_connection.on('suitSelectionUpdate', (args) => {
                    log("debug", `Received suit selection update ${JSON.stringify(args)}`)
                    const selections = suitSelectionHistory;
                    selections.push(args)
                    setSuitSelectionHistory(selections)
                })

                setSocket(socket_connection)

                // disconnect from socket on component unmount
                return () => {
                    disconnectFromSocket(socket_connection)
                }
            }
        }
        else {
            // if no username go set one here
            if (roomNameAvailable) {
                if (roomID) navigate(`/belote/lobby/${roomID}`)
                if (urlRoomId) navigate(`/belote/lobby/${urlRoomId}`)
            }
            // if no room and no username just go home
            else navigate("/")
        }
    }, [roomID, gameSocketID, displayName]);

    // check if player is switching belote lobbies to reset socket and vars
    useEffect(() => {
        setLobbyEvents([])
    }, [roomID])


    const handleDeckSplit = (index) => {
        socket.emit("splitDeck", index);
    }

    const handleSuitSelect = (suit) => {
        socket.emit("suitSelect", suit);
    }

    const handleCardPlay = (card) => {
        // auto-anounce selected premiums
        if (selectedPremiums.length > 0) {
            handleAnouncePremiums(selectedPremiums);
            setSelectedPremiums([])
        }
        socket.emit("cardPlay", card);
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
                                                    selectedPremiums={selectedPremiums}
                                                    setSelectedPremiums={setSelectedPremiums}
                                                    handleAnouncePremiums={handleAnouncePremiums}
                                                />
                                                <Hand
                                                    showCards={true}
                                                    vertical={false}
                                                    cardCount={playerHand.length}
                                                    cards={playerHand}
                                                    validOptions={playerHandValidOptions}
                                                    roundStatus={roundStatus.status}
                                                    suitInfo={roundStatus.suitInfo}
                                                    playSelectedCard={handleCardPlay}
                                                />
                                            </div>
                                            <div />
                                        </div>
                                    </div>
                                </div>
                                {windowWidth > 1280 &&
                                    <div>
                                        <div className={styles.indicatorsContainer}>
                                            {roundStatus &&
                                                <PremiumIndicator
                                                    premiums={roundStatus.premiums}
                                                />
                                            }
                                            <RoomChat events={lobbyEvents} />

                                            <GameStatusIndicator
                                                gameStatus={gameStatus}
                                                roundStatus={roundStatus}
                                                roomID={roomID}
                                            />
                                            {roundStatus &&
                                                <HandHistory
                                                    roundStatus={roundStatus}
                                                />
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        </Col>
                        <Col sm={0} md={0} lg={1} xl={1} />
                    </Row>
                    {
                        windowWidth <= 1280 &&
                        <Row>
                            <Col md={1} />
                            <Col md={10}>
                                <Tabs defaultActiveKey="gameStatus">
                                    <Tab eventKey="gameStatus" title="Game Status">
                                        <GameStatusIndicator
                                            gameStatus={gameStatus}
                                            roundStatus={roundStatus}
                                            roomID={roomID}
                                        />
                                    </Tab>
                                    <Tab eventKey="premiums" title="Premiums">
                                        <PremiumIndicator
                                            premiums={roundStatus.premiums}
                                        />
                                    </Tab>
                                    <Tab eventKey="handHistory" title="Hand History">
                                        <HandHistory
                                            roundStatus={roundStatus}
                                        />
                                    </Tab>
                                    {lobbyEvents.length > 0 &&
                                        <Tab eventKey="lobbyActivity" title="Lobby Activity">
                                            <RoomChat events={lobbyEvents} />
                                        </Tab>
                                    }
                                </Tabs>
                            </Col>
                        </Row>
                    }
                </div >
            }
        </div >
    );
}

export default BelotePage;