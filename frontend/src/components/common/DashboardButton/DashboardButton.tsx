import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import styles from './DashboardButton.module.scss';

export default function DashboardButton() {
    return (
        <Link className={styles.container} to="/dashboard" title="Ver o mapa">
            <FontAwesomeIcon icon={faMapLocationDot} />
        </Link>
    );
}
