import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useUsers from '../hooks/useUsers';
import { IUserDTO } from '../services/users.service';

interface IUserContextValue {
    user: IUserDTO | null;
    refreshUser: () => Promise<void>;
}

export const UserContext = createContext<IUserContextValue | null>(null);

interface IProps {
    children: ReactNode;
}

export function UserInfosProvider({ children }: IProps) {
    const { token } = useAuth();
    const { getUser } = useUsers();
    const [user, setUser] = useState<IUserDTO | null>(null);

    const refreshUser = useCallback(async () => {
        if (!token) {
            setUser(null);
            return;
        }

        try {
            const currentUser = await getUser(token);
            setUser(currentUser);
        } catch (error) {
            console.error('Falha ao carregar usuário!', error);
            setUser(null);
        }
    }, [getUser, token]);

    useEffect(() => {
        void refreshUser();
    }, [refreshUser]);

    const value = useMemo(() => ({ user, refreshUser }), [user, refreshUser]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
