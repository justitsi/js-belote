import styles from './RoomChat.module.scss'

function RoomChat(props) {
    const lines = []
    for (const event of props.events) {
        let line;
        if (event.action === "joined") {
            line = (
                <li className={styles.roomChatListItem}>
                    <p className={styles.playerJoinText}>
                        Player {event.client.displayName} joined the room
                    </p>
                </li>
            );
        }

        if (event.action === "left") {
            line = (
                <li className={styles.roomChatListItem}>
                    <p className={styles.playerLeaveText}>
                        Player {event.client.displayName} left the room
                    </p>
                </li>
            );
        }
        lines.push(line)
    }


    return (
        <div className={styles.roomChatContainer}>
            <h3>Room Chat</h3>
            <div className={styles.roomChatListContainer}>
                <ul className={styles.roomChatList}>
                    {lines}
                </ul>
            </div>
        </div>
    );
}
export default RoomChat