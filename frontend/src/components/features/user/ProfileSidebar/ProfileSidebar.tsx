import Menu from '../../../ui/Menu/Menu';
import defaultPictureUrl from '@/assets/default-picture.png';
import useProfile from '../../../../hooks/useProfile';

import styles from './ProfileSidebar.module.scss';

export default function ProfileSidebar() {
    const { currPhoto, currUsername, screen, setScreen } = useProfile();
    const setProfile = () => setScreen('profile');
    const setPassword = () => setScreen('password');

    return (
        <aside className={styles.container}>
            <div>
                <img src={currPhoto || defaultPictureUrl} alt="" />
                <span>{currUsername || 'Fulano'}</span>
            </div>

            <Menu activeClass={styles.active}>
                <Menu.Item active={screen === 'profile'} onClick={setProfile}>
                    Editar perfil
                </Menu.Item>
                <Menu.Item active={screen === 'password'} onClick={setPassword}>
                    Trocar senha
                </Menu.Item>
            </Menu>
        </aside>
    );
}
