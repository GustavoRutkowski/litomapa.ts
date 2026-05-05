import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';

import styles from './NotificationsButton.module.scss';

interface IProps {
    unreadNotifications?: number;
}

export default function NotificationsButton({ unreadNotifications: counter }: IProps = {}) {
    return (
        <Link className={styles.container} to="/dashboard" title="Notificações">
            {counter && counter > 0 ? <span>{counter}</span> : null}
            <FontAwesomeIcon icon={faBell} />
        </Link>
    );
}
