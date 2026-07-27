import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../../../../hooks/useAuth';
import { useEffect, useRef, useState } from 'react';
import UserDropdown from '../UserDropdown/UserDropdown';
import defaultPictureUrl from '@/assets/default-picture.png';
import useUserInfos from '../../../../hooks/useUserInfos';

import styles from './UserDropdownButton.module.scss';

export default function UserDropdownButton() {
    const { token } = useAuth();
    if (!token) return null;

    const { user } = useUserInfos();
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

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

    const formatPhoto = (photo: string | null | undefined) => {
        if (!photo) return null;
        return `/api/uploads/${photo}`;
    };

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
                    <img src={formatPhoto(user?.photo) || defaultPictureUrl} alt="Foto de Perfil" />
                    <span>{user?.username || 'Usuário'}</span>
                </div>
                <FontAwesomeIcon icon={faAngleDown} />
            </button>

            <UserDropdown open={open} onClose={() => setOpen(false)} />
        </div>
    );
}
