import UserDropdownButton from '../../features/user/UserDropdownButton/UserDropdownButton';
import logoUrl from '@/assets/logo.png';

import styles from './Header.module.scss';
import DashboardButton from '../DashboardButton/DashboardButton';
import ForumButton from '../ForumButton/ForumButton';

export default function Header() {
    return (
        <header className={styles.container}>
            <div className={styles.container__topRow}>
                <div className={styles.container__logo}>
                    <img src={logoUrl} alt="LitoMapa logo" />
                    <h1>Litomapa</h1>
                </div>

                <UserDropdownButton />
            </div>

            <div className={styles.container__bottomRow}>
                <DashboardButton />
                <ForumButton />
            </div>
        </header>
    );
}
