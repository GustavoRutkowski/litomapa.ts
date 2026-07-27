import { useState } from 'react';
import HeaderModal from '../../../ui/HeaderModal/HeaderModal';
import ProfileSidebar from '../ProfileSidebar/ProfileSidebar';
import ProfileScreen from '../ProfileScreen/ProfileScreen';
import PasswordScreen from '../PasswordScreen/PasswordScreen';
import { ProfileProvider } from '../../../../contexts/ProfileContext';
import useProfile from '../../../../hooks/useProfile';

import styles from './ProfileModal.module.scss';

type PopupConfig = {
    type: 'success' | 'error';
    message: string;
    timeout: number;
};

interface IProps {
    open: boolean;
    onClose: () => void;
}

function ProfileModal({ open, onClose }: IProps) {
    return (
        <>
            <HeaderModal title="Configurações de perfil" open={open} onClose={onClose}>
                <ProfileProvider>
                    <div className={styles.container}>
                        <ProfileModal.Sidebar />
                        <ProfileModal.Screen onClose={onClose} />
                    </div>
                </ProfileProvider>
            </HeaderModal>
        </>
    );
}

ProfileModal.Sidebar = ProfileSidebar;

interface IScreenProps {
    onClose: () => void;
}

ProfileModal.Screen = ({ onClose }: IScreenProps) => {
    const { screen } = useProfile();
    return (
        <section className={styles.screen}>
            {screen === 'profile' ? <ProfileScreen onClose={onClose} /> : <PasswordScreen />}
        </section>
    );
};

export default ProfileModal;
