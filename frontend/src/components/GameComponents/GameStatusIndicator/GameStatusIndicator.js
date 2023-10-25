import styles from './GameStatusIndicator.module.scss';
import { useTranslation } from 'react-i18next';
import IndicatorBox from './../IndicatorBox';
import { Table, ListGroup, InputGroup } from 'react-bootstrap'

function GameStatusIndicator(props) {
    const { t } = useTranslation('translations');

    if (props.gameStatus) {
        if (props.gameStatus.teamsValid === true) {
            return (
                <div className={styles.container}>
                    <IndicatorBox
                        header={t('gameStatusIndicator.containerLabel')}
                        scroll={false}
                        height={14.5}
                        content={
                            <div>
                                <Table className={styles.gameInfoTable}>
                                    <thead className={styles.tableHeader}>
                                        <tr className={styles.tableHeaderRow}>
                                            <th />
                                            <th className={styles.tableHeaderData}>{t('gameStatusIndicator.teamLabel')} 1 ({props.gameStatus.teams[0][0]} {props.gameStatus.teams[0][1]})</th>
                                            <th className={styles.tableHeaderData}>{t('gameStatusIndicator.teamLabel')} 2 ({props.gameStatus.teams[1][0]} {props.gameStatus.teams[1][1]})</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th className={styles.tableHeaderData}>{t('gameStatusIndicator.scoreLabel')}</th>
                                            <td className={styles.tableBodyData}>{props.gameStatus.teamScores[0]}</td>
                                            <td className={styles.tableBodyData}>{props.gameStatus.teamScores[1]}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <ListGroup variant="flush">
                                    {((props.roundStatus.status === 'in_progress' || props.roundStatus.status === 'suit_selected') && (props.gameStatus.status !== 'over')) &&
                                        <ListGroup.Item>
                                            {t('gameStatusIndicator.roundSuitLabel')}
                                            <b> {t(`suitSelector.suits.${props.roundStatus.suitInfo.suit}`)}</b>
                                            {t('gameStatusIndicator.roundSuitCallerLabel')}
                                            <b>{props.roundStatus.suitInfo.caller}</b>
                                        </ListGroup.Item>
                                    }
                                    {(props.gameStatus.status === 'over') &&
                                        <ListGroup.Item>
                                            {t('gameStatusIndicator.winningTeamLabel')}
                                            <b>{props.gameStatus.winningTeam}</b>
                                        </ListGroup.Item>
                                    }
                                </ListGroup>
                            </div>
                        }
                    />

                </div>
            );
        }
        else return (
            <div className={styles.container}>
                <IndicatorBox
                    header={t('gameStatusIndicator.containerLabel')}
                    scroll={false}
                    height={14.5}
                    content={
                        <div>
                            <Table>
                                <thead className={styles.tableHeader}>
                                    <tr className={styles.tableHeaderRow}>
                                        <th >{t('gameStatusIndicator.teamLabel')} 1</th>
                                        <th >{t('gameStatusIndicator.teamLabel')} 2</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.gameStatus.teams &&
                                        <tr>
                                            <td>
                                                {props.gameStatus.teams[0][0]} {props.gameStatus.teams[0][1]}
                                            </td>
                                            <td>
                                                {props.gameStatus.teams[1][0]} {props.gameStatus.teams[1][1]}
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </Table>
                            <label className={styles.waitingLabel}>{t('gameStatusIndicator.waitingForLabelsToConnectLabel')}</label>
                            <InputGroup.Text disabled>
                                {`https://belotewithfriends.tk/game/room/${props.roomID}`}
                            </InputGroup.Text>
                        </div>
                    }
                />
            </div>
        )
    }
    else return (
        <div>
            {t('gameStatusIndicator.waitingToConnectToServerLabel')}
        </div>
    );
}

export default GameStatusIndicator;