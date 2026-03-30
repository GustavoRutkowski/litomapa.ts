import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../../hooks/useAuth';
import useUsers from '../../hooks/useUsers';
import { useEffect, useState } from 'react';
import { IUserDTO } from '../../services/users.service';

import styles from './UserOptionsButton.module.scss';

export default function UserOptionsButton() {
    const { token } = useAuth();
    if (!token) return;
    
    const { getUser } = useUsers();
    const [user, setUser] = useState<IUserDTO | null>(null);

    useEffect(() => {
        const findUser = async () => {
            try {
                const res = await getUser(token);
                setUser(res);
            } catch (e) {
                console.error('Falha ao carregar usuário!', e);
            }
        };
        findUser();
    }, []);

    return (
        <button className={styles.container}>
            <div className={styles.container__user}>
                <img src={user?.photo || './src/assets/default-picture.png'} alt="Foto de Perfil" />
                <span>{user?.username}</span>
            </div>
            <FontAwesomeIcon icon={faAngleDown} />
        </button>
    );
}
