import styles from './RoomChat.module.scss';
import { Card } from 'react-bootstrap';
import IndicatorBox from './../IndicatorBox'
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

function RoomChat(props) {
    const { t } = useTranslation('translations');
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
                <li className={styles.roomChatListItem} key={uuidv4()}>
                    <p className={styles.playerLeaveText}>
                        Player {event.client.displayName} left the room
                    </p>
                </li>
            );
        }
        lines.push(line)
    }

    lines.reverse()

    return (
        <IndicatorBox
            header={t('roomChat.containerLabel')}
            scroll={true}
            content={
                <div className={styles.roomChatListContainer}>
                    <ul className={styles.roomChatList}>
                        {lines}
                    </ul>
                </div>
            }
        />
    );
}
export default RoomChat