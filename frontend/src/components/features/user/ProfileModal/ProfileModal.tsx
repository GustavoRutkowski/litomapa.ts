import HeaderModal from '../../../ui/HeaderModal/HeaderModal';
import ProfileSidebar from '../ProfileSidebar/ProfileSidebar';
import ProfileScreen from '../ProfileScreen/ProfileScreen';
import PasswordScreen from '../PasswordScreen/PasswordScreen';
import { ProfileProvider } from '../../../../contexts/ProfileContext';
import useProfile from '../../../../hooks/useProfile';

import styles from './ProfileModal.module.scss';

interface IProps {
    open: boolean;
    onClose: () => void;
}

function ProfileModal({ open, onClose }: IProps) {
    return (
        <HeaderModal title="Configurações de perfil" open={open} onClose={onClose}>
            <ProfileProvider>
                <div className={styles.container}>
                    <ProfileModal.Sidebar />
                    <ProfileModal.Screen />
                </div>
            </ProfileProvider>
        </HeaderModal>
    );
}

ProfileModal.Sidebar = ProfileSidebar;
ProfileModal.Screen = () => {
    const { screen } = useProfile();
    return (
        <section className={styles.screen}>
            {screen === 'profile' ? <ProfileScreen /> : <PasswordScreen />}
        </section>
    );
};

export default ProfileModal;
