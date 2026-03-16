import { createContext, ReactNode, useCallback, useState } from 'react';
import useUsers from '../hooks/useUsers';
import { IUserDTO } from '../services/users.service';
import LocalData from '../utils/LocalData';

type TAuthCallback = (body: IUserDTO) => Promise<void>;
interface IAuthContext {
	token: string | null;
	login: TAuthCallback;
	logout: TAuthCallback;
}

export const AuthContext = createContext<IAuthContext | null>(null);

interface IProps { children: ReactNode }
export function AuthProvider({ children }: IProps) {
	const [token, setToken] = useState<string | null>(null);

	const login = useCallback(async (body: IUserDTO) => {
		const { login } = useUsers();
		const { token } = await login(body);

		LocalData.set('token', token);
		setToken(token);
	}, []);

	const logout = useCallback(async () => {
		LocalData.remove('token');
		setToken(null);
	}, []);

	return (
		<AuthContext.Provider value={{ token, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}
