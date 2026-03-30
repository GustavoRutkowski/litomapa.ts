import { useCallback } from 'react';
import {
    IUserDTO, createUser as create,
    loginUser, getUser as get
} from '../services/users.service';

export default function useUsers() {   
    const createUser = useCallback(async (body: IUserDTO) => await create(body), []);
    const login = useCallback(async (body: IUserDTO) => await loginUser(body), []);

    const getUser = useCallback(async (token: string) => {
        if (!token) throw new Error('No authentication token available');
        return await get(token);
    }, []);

    return { createUser, login, getUser };
}
