import { Card } from 'react-bootstrap';
import styles from './IndicatorBox.module.scss'

function IndicatorBox(props) {
    if (props.scroll)
        return (
            <div className={styles.indicatorBoxContainerScroll}>
                <Card>
                    <h3 className={styles.containerLabel}>{props.header}</h3>
                    <Card className={styles.indicatorBoxCnotentScroll}>
                        {props.content}
                    </Card>
                </Card>
            </div>
        )
    else
        return (
            <div className={styles.indicatorBoxContainerNoScroll}>
                <Card className={styles.card}>
                    <h3 className={styles.containerLabel}>{props.header}</h3>
                    <Card className={styles.indicatorBoxCnotentNoScroll}>
                        {props.content}
                    </Card>
                </Card >
            </div >
        )
}
export default IndicatorBox