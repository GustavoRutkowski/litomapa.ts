import ICreated from '../types/ICreated';
import Api from '../utils/Api';

type TEmail = `${string}@${string}.${string}`;

export interface IUserDTO {
    id?: number;
    username?: string;
    email?: TEmail;
    password?: string;
    photo?: string | null;
}

const api = new Api('/api/users');

export async function createUser({ username, email, password }: IUserDTO): Promise<ICreated> {
    return await api.post<ICreated>('/', {
        body: { username, email, password }
    });
}

interface ILoginResponse {
    token: string;
}

export async function loginUser({ email, password }: IUserDTO): Promise<ILoginResponse> {
    return await api.post<ILoginResponse>('/login', {
        body: { email, password }
    });
}

export async function getUser(token: string): Promise<IUserDTO> {
    return await api.get<IUserDTO>('/', {
        headers: new Headers({ 'Authorization': `Bearer ${token}` })
    });
}

export function changeUsername() {}
export function changePassword() {}
export function changePhoto() {}
export function removePhoto() {}
export function deleteUser() {}
