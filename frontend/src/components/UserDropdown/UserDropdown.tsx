import useAuth from '../../hooks/useAuth';
import ProfileModal from '../ProfileModal/ProfileModal';
import IDropdownItem from '../../types/IDropdownItem';
import DropdownMenu from '../DropdownMenu/DropdownMenu';
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

    const items: IDropdownItem[] = [
        { key: 'profile', title: 'Perfil', onClick: showProfileModal },
        { key: 'change-password', title: 'Mudar Senha' },
        { key: 'notifications', title: 'Notificações' },
        { key: 'logout', title: 'Sair', onClick: logout }
    ];

    return (
        <div className={styles.container}>
            {open && <DropdownMenu open={open} items={items} />}
            <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
        </div>
    );
}
