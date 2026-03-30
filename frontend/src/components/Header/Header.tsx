import UserOptionsButton from '../UserOptionsButton/UserOptionsButton';
import NotificationsButton from '../NotificationsButton/NotificationsButton';

import styles from './Header.module.scss';

export default function Header() {
    return (
        <header className={styles.container}>
            <div className={styles.container__logo}>
                <img src="./src/assets/logo.png" alt="" />
                <h1>Litomapa</h1>
            </div>

            <div className={styles.container__options}>
                <UserOptionsButton />
                <NotificationsButton />
            </div>
        </header>
    );
}
