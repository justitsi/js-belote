import { Card } from 'react-bootstrap';
import styles from './IndicatorBox.module.scss'

function IndicatorBox(props) {
    return (
        <div className={styles.indicatorBoxContainer}>
            <Card>
                <h3 className={styles.containerLabel}>{props.header}</h3>
                <Card className={styles.indicatorBoxCnotent}>
                    {props.content}
                </Card>
            </Card>
        </div>
    )
}
export default IndicatorBox