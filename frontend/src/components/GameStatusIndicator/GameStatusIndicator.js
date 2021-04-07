import styles from './GameStatusIndicator.module.scss'
import { useTranslation } from 'react-i18next';

function GameStatusIndicator(props) {
    const { t } = useTranslation('translations');

    if (props.gameStatus) {
        if (props.gameStatus.teamsValid === true) {
            return (
                <div className={styles.container}>
                    <h3 className={styles.gameStatusContainerLabel}>
                        {t('gameStatusIndicator.containerLabel')}
                    </h3>
                    <div className={styles.statusTableContainer}>
                        <table className={styles.gameInfoTable}>
                            <tbody>
                                <tr>
                                    <th />
                                    <th>{props.gameStatus.teams[0][0]} <br /> {props.gameStatus.teams[0][1]}</th>
                                    <th>{props.gameStatus.teams[1][0]} <br /> {props.gameStatus.teams[1][1]}</th>
                                </tr>
                                <tr>
                                    <th>{t('gameStatusIndicator.scoreLabel')}</th>
                                    <td>{props.gameStatus.teamScores[0]}</td>
                                    <td>{props.gameStatus.teamScores[1]}</td>
                                </tr>
                                <tr>
                                    <th>{t('gameStatusIndicator.roundNumberLabel')}</th>
                                    <td>{props.gameStatus.roundNum}</td>
                                </tr>
                                <tr>
                                    <th>{t('gameStatusIndicator.consecutivePassedGamesLabel')}</th>
                                    <td>{props.gameStatus.consecutivePasses}</td>
                                </tr>
                                {(props.roundStatus.status === 'in_progress' || props.roundStatus.status === 'suit_selected') &&
                                    <tr>
                                        <th>{t('gameStatusIndicator.roundSuitLabel')}</th>
                                        <td>{props.roundStatus.suitInfo.suit}</td>
                                    </tr>
                                }
                                {(props.roundStatus.status === 'in_progress' || props.roundStatus.status === 'suit_selected') &&
                                    <tr>
                                        <th>{t('gameStatusIndicator.roundSuitCallerLabel')}</th>
                                        <td>{props.roundStatus.suitInfo.caller}</td>
                                    </tr>
                                }
                                {props.gameStatus.winningTeam &&
                                    <tr>
                                        <th>{t('gameStatusIndicator.winningTeamLabel')}</th>
                                        <td>
                                            {props.gameStatus.teams[props.gameStatus.winningTeam].p1}
                                            {props.gameStatus.teams[props.gameStatus.winningTeam].p2}
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }
        else return (
            <div>
                {t('gameStatusIndicator.waitingForLabelsToConnectLabel')}
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