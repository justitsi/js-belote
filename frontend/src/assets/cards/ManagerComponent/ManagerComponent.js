import { ReactComponent as B } from './../1B.svg';
import { ReactComponent as TC } from './../TC.svg';
import { ReactComponent as TD } from './../TD.svg';
import { ReactComponent as TH } from './../TH.svg';
import { ReactComponent as TS } from './../TS.svg';
import { ReactComponent as QC } from './../QC.svg';
import { ReactComponent as QD } from './../QD.svg';
import { ReactComponent as QH } from './../QH.svg';
import { ReactComponent as QS } from './../QS.svg';
import { ReactComponent as KC } from './../KC.svg';
import { ReactComponent as KD } from './../KD.svg';
import { ReactComponent as KH } from './../KH.svg';
import { ReactComponent as KS } from './../KS.svg';
import { ReactComponent as JC } from './../JC.svg';
import { ReactComponent as JD } from './../JD.svg';
import { ReactComponent as JH } from './../JH.svg';
import { ReactComponent as JS } from './../JS.svg';
import { ReactComponent as AC } from './../AC.svg';
import { ReactComponent as AD } from './../AD.svg';
import { ReactComponent as AH } from './../AH.svg';
import { ReactComponent as AS } from './../AS.svg';
import { ReactComponent as NC } from './../9C.svg';
import { ReactComponent as ND } from './../9D.svg';
import { ReactComponent as NH } from './../9H.svg';
import { ReactComponent as NS } from './../9S.svg';
import { ReactComponent as EC } from './../8C.svg';
import { ReactComponent as ED } from './../8D.svg';
import { ReactComponent as EH } from './../8H.svg';
import { ReactComponent as ES } from './../8S.svg';
import { ReactComponent as SC } from './../7C.svg';
import { ReactComponent as SD } from './../7D.svg';
import { ReactComponent as SH } from './../7H.svg';
import { ReactComponent as SS } from './../7S.svg';

import styles from './ManagerComponent.module.scss';

function ManagerComponent(props) {
    const cardRanks = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    const cCards = [SC, EC, NC, TC, JC, QC, KC, AC];
    const dCards = [SD, ED, ND, TD, JD, QD, KD, AD];
    const hCards = [SH, EH, NH, TH, JH, QH, KH, AH];
    const sCards = [SS, ES, NS, TS, JS, QS, KS, AS];


    let arrToUse;
    if (props.suit === 'c' || props.suit === 'C') arrToUse = cCards;
    if (props.suit === 'd' || props.suit === 'D') arrToUse = dCards;
    if (props.suit === 'h' || props.suit === 'H') arrToUse = hCards;
    if (props.suit === 's' || props.suit === 'S') arrToUse = sCards;

    const rankIndex = cardRanks.indexOf(props.rank);
    const SvgElement = arrToUse[rankIndex];

    return (
        <div>
            <SvgElement
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
}
export default ManagerComponent;