import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../../../../hooks/useAuth';
import useUsers from '../../../../hooks/useUsers';
import { useEffect, useId, useState, ChangeEvent } from 'react';
import { IUserDTO } from '../../../../services/users.service';
import defaultPictureUrl from '@/assets/default-picture.png';
import HeaderModal from '../../../ui/HeaderModal/HeaderModal';

import styles from './ProfileModal.module.scss';

interface IProps {
    open: boolean;
    onClose: () => void;
}

export default function ProfileModal({ open, onClose }: IProps) {
    const { token } = useAuth();
    if (!token) return null;

    const { getUser } = useUsers();
    const [user, setUser] = useState<IUserDTO | null>(null);
    const [photo, setPhoto] = useState<string | null>(user?.photo || null);

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

    const pictureInputId = useId();

    const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        if (!file) {
            setPhoto(null);
            return;
        }
        const url = URL.createObjectURL(file);
        setPhoto(url);
    };

    return (
        <HeaderModal title="Configurações de perfil" open={open} onClose={onClose}>
            <form className={styles.form}>
                <div className={styles['profile-container']}>
                    <fieldset>
                        <label htmlFor={pictureInputId}>
                            <img src={photo || defaultPictureUrl} alt="Foto do usuário" />
                        </label>
                        <input
                            id={pictureInputId}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handlePhotoChange}
                        />
                    </fieldset>

                    <fieldset>
                        <input type="text" defaultValue={user?.username} />
                    </fieldset>
                </div>

                <button type="button" className={styles['save-changes-button']}>
                    <FontAwesomeIcon icon={faFloppyDisk} />
                    <span>Salvar Alterações</span>
                </button>
            </form>
        </HeaderModal>
    );
}
