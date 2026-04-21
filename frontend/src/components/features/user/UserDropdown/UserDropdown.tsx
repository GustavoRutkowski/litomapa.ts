import useAuth from '../../../../hooks/useAuth';
import ProfileModal from '../ProfileModal/ProfileModal';
import Menu from '../../../ui/Menu/Menu';
import { useState } from 'react';

import styles from './UserDropdown.module.scss';

interface IProps {
    open: boolean;
    onClose: () => void;
}

export default function UserDropdown({ open, onClose }: IProps) {
    const { logout } = useAuth();
    const [profileOpen, setProfileOpen] = useState(false);

    const showProfileModal = () => {
        setProfileOpen(true);
        onClose();
    };

    const modal = <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />;

    if (!open) return <div className={styles.container}>{modal}</div>;

    return (
        <div className={styles.container}>
            <section className={styles.dropdown}>
                <Menu open={open}>
                    <Menu.Item onClick={showProfileModal}>Perfil</Menu.Item>
                    <Menu.Item>Notificações</Menu.Item>
                    <Menu.Item onClick={logout}>Sair</Menu.Item>
                </Menu>
            </section>

            {modal}
        </div>
    );
}
