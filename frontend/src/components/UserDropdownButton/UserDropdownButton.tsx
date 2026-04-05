import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../../hooks/useAuth';
import useUsers from '../../hooks/useUsers';
import { useEffect, useRef, useState } from 'react';
import { IUserDTO } from '../../services/users.service';
import UserDropdown from '../UserDropdown/UserDropdown';
import defaultPictureUrl from '@/assets/default-picture.png';

import styles from './UserDropdownButton.module.scss';

export default function UserDropdownButton() {
    const { token } = useAuth();
    if (!token) return null;
    
    const { getUser } = useUsers();
    const [user, setUser] = useState<IUserDTO | null>(null);
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

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
    }, [token]);

    useEffect(() => {
        const handleOutside = (e: MouseEvent | TouchEvent) => {
            if (!wrapperRef.current) return;
            const target = e.target as Node;
            if (!wrapperRef.current.contains(target)) setOpen(false);
        };
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };

        document.addEventListener('mousedown', handleOutside);
        document.addEventListener('touchstart', handleOutside);
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handleOutside);
            document.removeEventListener('touchstart', handleOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, []);

    return (
        <div ref={wrapperRef} className={styles.container}>
            <button
                type="button"
                className={styles['dropdown-button']}
                onClick={() => setOpen(v => !v)}
                aria-expanded={open}
                aria-haspopup="menu"
            >
                <div className={styles.user}>
                    <img src={user?.photo || defaultPictureUrl} alt="Foto de Perfil" />
                    <span>{user?.username}</span>
                </div>
                <FontAwesomeIcon icon={faAngleDown} />
            </button>

            <UserDropdown open={open} onClose={() => setOpen(false)} />
        </div>
    );
}
