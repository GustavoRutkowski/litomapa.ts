import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import styles from './ForumButton.module.scss';

interface IProps {
    unreadNotifications?: number;
}

export default function ForumButton({ unreadNotifications: counter }: IProps = {}) {
    return (
        <Link className={styles.container} to="/forum" title="Fórum">
            {counter && counter > 0 ? <span>{counter}</span> : null}
            <FontAwesomeIcon icon={faComments} />
        </Link>
    );
}
