import styles from './BelotePage.module.scss'
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react'
import CONSTANTS from './../../modules/CONSTANTS.json'
import { connectToSocket, disconnectFromSocket } from '../../modules/socketActions'
import GameStatusIndicator from './../../components/GameStatusIndicator'
import Hand from './../../components/Hand'
import GameBoard from './../../components/GameBoard'

function BelotePage(props) {
    const { t } = useTranslation('translations');
    const [server, setServer] = useState(CONSTANTS.game_server_addr)
    const [roomID, setRoomID] = useState(props.match.params.roomID)
    const [clientID, setClientID] = useState('default_client_id')
    const [displayName, setDisplayName] = useState('hristo_1')
    const [gameStatus, setGameStatus] = useState(null)


    let socket_connection = connectToSocket(server, roomID, clientID, displayName);


    useEffect(() => {
        socket_connection.on("gameStatusUpdate", (args) => {
            console.log(`Received game status update ${JSON.stringify(args)}`)
            setGameStatus(args)
        });
    }, []);

    return (
        <div className={styles.page} >
            Belote Page: {roomID}
            <GameStatusIndicator gameStatus={gameStatus} />
            <GameBoard cards={[null, { rank: "7", suit: "S" }]} numOfCardsInHand={[7, 8, 8]} pTurn={'S'} />
            <div className={styles.handContainer}>
                <Hand
                    showCards={true}
                    cardCount={8}
                    vertical={false}
                    cards={[
                        { rank: '7', suit: 'H' },
                        { rank: '8', suit: 'H' },
                        { rank: '7', suit: 'C' },
                        { rank: '8', suit: 'C' },
                        { rank: '9', suit: 'C' },
                        { rank: '7', suit: 'D' },
                        { rank: '8', suit: 'D' },
                        { rank: '8', suit: 'S' },
                    ]}
                    playSelectedCard={(card) => { console.log(`playing card: ${JSON.stringify(card)}`) }}
                />
            </div>

        </div >
    );
}

export default BelotePage;