import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import useUsers from '../hooks/useUsers';
import { IUserDTO } from '../services/users.service';
import LocalData from '../utils/LocalData';

interface IAuthContext {
    token: string | null;
    isLoading: boolean;
    login: (body: IUserDTO) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContext | null>(null);

interface IProps {
    children: ReactNode;
}
export function AuthProvider({ children }: IProps) {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const users = useUsers();

    useEffect(() => {
        const stored = LocalData.get<string>('token');
        if (stored) setToken(stored);
        setIsLoading(false);
    }, []);

    const login = useCallback(
        async (body: IUserDTO) => {
            const { token } = await users.login(body);

            LocalData.set('token', token);
            setToken(token);
        },
        [users.login]
    );

    const logout = useCallback(async () => {
        LocalData.remove('token');
        setToken(null);
    }, []);

    return (
        <AuthContext.Provider value={{ token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
