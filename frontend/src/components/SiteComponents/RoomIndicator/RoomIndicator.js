import styles from './RoomIndicator.module.scss'
import { Card, Button, Table } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const RoomIndicator = (props) => {
    const navigate = useNavigate();
    const { t } = useTranslation('translations');
    const players = [...props.players]

    for (let i = 0; i < players.length; i++) {
        if (i % 2 === 0) players[i].team = 0;
        else players[i].team = 1;
    }

    const teams = [[], []]
    for (const player of players) {
        if (teams[player.team].length === 1) {
            teams[player.team].push(`, ${player.displayName}`)
        }
        else teams[player.team].push(player.displayName)
    }

    const joinRoom = () => {
        navigate(`/belote/room/${props.roomID}`);
    }

    return (
        <div className={styles.container}>
            <Card>
                <Card.Body>
                    <Card.Title>{t('activeRoomCard.label')} {props.roomID}</Card.Title>
                    <Card.Subtitle>{players.length}/4 {t("activeRoomCard.connected")}</Card.Subtitle>
                    <br />
                    <Table size="sm" hover>
                        <thead>
                            <tr>
                                <th>{t('activeRoomCard.teamLabel')} 1</th>
                                <th>{t('activeRoomCard.teamLabel')} 2</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className={styles.tablePlayerNameRow}>
                                <td className={styles.tablePlayerNameCell}>{teams[0][0]}</td>
                                <td className={styles.tablePlayerNameCell}>{teams[1][0]}</td>
                            </tr>
                            <tr className={styles.tablePlayerNameRow}>
                                <td className={styles.tablePlayerNameCell}>{teams[1][1]}</td>
                                <td className={styles.tablePlayerNameCell}>{teams[0][1]}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <div className={styles.joinBtnContainer}>
                        <Button
                            variant="primary"
                            className={styles.joinBtn}
                            onClick={joinRoom}
                        >
                            {t('gameIndicator.joinBtnLabel')}
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );

}
export default RoomIndicator;