import styles from './BelotePage.module.scss'
import { useTranslation } from 'react-i18next';
import { useState } from 'react'
import CONSTANTS from './../../modules/CONSTANTS.json'
import { connectToSocket, disconnectFromSocket } from '../../modules/socketActions'

function BelotePage(props) {
    const { t } = useTranslation('translations');
    const [server, setServer] = useState(CONSTANTS.game_server_addr)
    const [roomID, setRoomID] = useState(props.match.params.roomID)
    const [clientID, setClientID] = useState('default_client_id')

    let socket_connection = connectToSocket(server, roomID, clientID);

    socket_connection.on("message", (args) => {
        console.log(`Received message ${JSON.stringify(args)}`)
    });

    return (
        <div className={styles.page}>
            Belote Page: {roomID}
        </div>
    );
}

export default BelotePage;