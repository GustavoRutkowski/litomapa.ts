import { ChangeEvent, useEffect, useId, useState } from 'react';
import useProfile from '../../../../hooks/useProfile';
import useUsers from '../../../../hooks/useUsers';
import useAuth from '../../../../hooks/useAuth';
import useModal from '../../../../hooks/useModal';
import useUserInfos from '../../../../hooks/useUserInfos';
import PhotoField from '../PhotoField/PhotoField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

import styles from './ProfileScreen.module.scss';

type ValidationErrors = {
    global?: string[];
    [field: string]: string[] | undefined;
};

type ApiErrorWithBody = {
    body?: {
        errors?: ValidationErrors;
    };
};

function getValidationErrors(error: unknown): ValidationErrors | undefined {
    if (typeof error !== 'object' || error === null) return undefined;

    const body = (error as ApiErrorWithBody).body;
    if (typeof body !== 'object' || body === null) return undefined;

    const errors = body.errors;
    if (typeof errors !== 'object' || errors === null) return undefined;

    return errors;
}

interface IProps {
    onClose: () => void;
}

export default function ProfileScreen({ onClose }: IProps) {
    const usernameInputId = useId();
    const { currUsername, setUsername, setScreen, currPhoto } = useProfile();
    const { token } = useAuth();
    const { changeInfos } = useUsers();
    const { refreshUser } = useUserInfos();
    const { onClose: closeModal } = useModal();

    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});
    const [isSaving, setIsSaving] = useState(false);

    const gotoPassword = () => setScreen('password');
    const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);

    const validateUsername = (username: string): string | null => {
        const trimmed = username.trim();
        if (trimmed.length < 3) return 'Nome de usuário muito curto (mínimo 3 caracteres).';
        if (trimmed.length > 20) return 'Nome de usuário muito longo (máximo 20 caracteres).';
        return null;
    };

    useEffect(() => {
        const errorMessage = validateUsername(currUsername);
        if (currUsername && errorMessage) {
            setFieldErrors(prev => ({ ...prev, username: errorMessage }));
            return;
        }
        if (currUsername) {
            setFieldErrors(prev => ({ ...prev, username: null }));
        }
    }, [currUsername]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const newFieldErrors: Record<string, string | null> = {};
        const usernameError = validateUsername(currUsername);
        if (usernameError) newFieldErrors.username = usernameError;

        if (Object.keys(newFieldErrors).length > 0) {
            setFieldErrors(newFieldErrors);
            return;
        }

        setFieldErrors({});
        setIsSaving(true);

        try {
            await changeInfos(token as string, {
                username: currUsername,
                photo: currPhoto ?? undefined
            });
            await refreshUser();
            closeModal();
            onClose();
        } catch (caughtError) {
            const serverErrors = getValidationErrors(caughtError);
            if (serverErrors) {
                const mapped: Record<string, string | null> = {};
                if (Array.isArray(serverErrors.global) && serverErrors.global.length > 0) {
                    setError(serverErrors.global[0]);
                }
                for (const key of Object.keys(serverErrors)) {
                    if (key === 'global') continue;
                    const arr = serverErrors[key];
                    if (Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'string') {
                        mapped[key] = arr[0];
                    }
                }
                setFieldErrors(mapped);
            } else {
                setError('Erro ao atualizar perfil. Tente novamente.');
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <header>
                <h3>Editar perfil</h3>
                <button type="button" onClick={gotoPassword}>
                    Trocar senha
                </button>
            </header>

            <form onSubmit={handleSubmit}>
                <PhotoField />

                <fieldset>
                    <label htmlFor={usernameInputId}>Nome</label>
                    <input
                        id={usernameInputId}
                        type="text"
                        placeholder="Digite o seu username"
                        value={currUsername}
                        onChange={onChangeUsername}
                    />
                    {fieldErrors.username ? (
                        <p className={styles['error-msg']}>{fieldErrors.username}</p>
                    ) : null}
                </fieldset>

                <button type="submit" disabled={isSaving}>
                    <FontAwesomeIcon icon={faFloppyDisk} />
                    <span>Salvar alterações</span>
                </button>
                {error ? <p className={styles['error-msg']}>{error}</p> : null}
            </form>
        </>
    );
}
