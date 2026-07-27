import { useContext } from 'react';
import { UserContext } from '../contexts/UserInfosContext';

export default function useUserInfos() {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUserInfos must be used inside UserProvider');
    return context;
}
