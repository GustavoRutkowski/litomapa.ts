import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import useUsers from '../hooks/useUsers';
import { IUserDTO } from '../services/users.service';
import useAuth from '../hooks/useAuth';

type Screen = 'profile' | 'password';

interface IProfileContext {
    screen: Screen;
    currPhoto: string | null;
    currUsername: string;
    setScreen: Dispatch<SetStateAction<Screen>>;
    setPhoto: Dispatch<SetStateAction<string | null>>;
    setUsername: Dispatch<SetStateAction<string>>;
}

export const ProfileContext = createContext<IProfileContext | null>(null);

interface IProps {
    children: ReactNode;
}

export function ProfileProvider({ children }: IProps) {
    const [screen, setScreen] = useState<Screen>('profile');
    const [currPhoto, setPhoto] = useState<string | null>(null);
    const [currUsername, setUsername] = useState<string>('');

    const { token } = useAuth();
    if (!token) return null;

    const { getUser } = useUsers();
    const [user, setUser] = useState<IUserDTO | null>(null);

    const fetchUser = async () => {
        try {
            const data = await getUser(token as string);
            setUser(data);
        } catch {
            throw new Error('Failed to fetch user');
        }
    };

    useEffect(() => {
        fetchUser().then(() => {
            setPhoto(user?.photo || null);
            setUsername(user?.username || '');
        });
    }, []);

    return (
        <ProfileContext.Provider
            value={{ screen, currPhoto, currUsername, setScreen, setPhoto, setUsername }}
        >
            {children}
        </ProfileContext.Provider>
    );
}
