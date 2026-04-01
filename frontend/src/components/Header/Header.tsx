import UserDropdownButton from '../UserDropdownButton/UserDropdownButton';
import NotificationsButton from '../NotificationsButton/NotificationsButton';
import logoUrl from '@/assets/logo.png';

import styles from './Header.module.scss';

export default function Header() {
    return (
        <header className={styles.container}>
            <div className={styles.container__logo}>
                <img src={logoUrl} alt="LitoMapa logo" />
                <h1>Litomapa</h1>
            </div>

            <div className={styles.container__options}>
                <UserDropdownButton />
                <NotificationsButton />
            </div>
        </header>
    );
}
