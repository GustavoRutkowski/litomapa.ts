import React, { useEffect, useId, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useUsers from '../../../../hooks/useUsers';
import TEmail from '../../../../types/TEmail';
import PasswordInput from '../../../ui/PasswordInput/PasswordInput';

import styles from './RegisterForm.module.scss';

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

export default function RegisterForm() {
    const usernameInputId = useId();
    const emailInputId = useId();
    const passwordInputId = useId();
    const navigate = useNavigate();

    const { createUser } = useUsers();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (pwd: string): string | null => {
        if (pwd.length < 8) return 'Senha deve ter ao menos 8 caracteres.';
        if (!/[a-z]/.test(pwd)) return 'Senha deve conter ao menos uma letra minúscula.';
        if (!/[A-Z]/.test(pwd)) return 'Senha deve conter ao menos uma letra maiúscula.';
        if (!/[0-9]/.test(pwd)) return 'Senha deve conter ao menos um número.';
        if (!/[^a-zA-Z0-9]/.test(pwd)) return 'Senha deve conter ao menos um caractere especial.';
        return null;
    };

    const validateUsername = (name: string): string | null => {
        if (name.trim().length < 3) return 'Nome de usuário muito curto (mínimo 3 caracteres).';
        if (name.trim().length > 20) return 'Nome de usuário muito longo (máximo 20 caracteres).';
        return null;
    };

    const cleanForms = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setError(null);
    };

    useEffect(() => {
        const isValid = isValidEmail(email);
        if (email && !isValid) {
            setFieldErrors(prev => ({ ...prev, email: 'Formato de e-mail inválido!' }));
            return;
        }
        if (email && isValid) setFieldErrors(prev => ({ ...prev, email: null }));
    }, [email]);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        // client-side validation aligned with backend
        const newFieldErrors: Record<string, string | null> = {};

        const un = validateUsername(username);
        if (un) newFieldErrors.username = un;

        if (!isValidEmail(email)) newFieldErrors.email = 'Formato de e-mail inválido!';

        const pw = validatePassword(password);
        if (pw) newFieldErrors.password = pw;

        if (Object.keys(newFieldErrors).length > 0) {
            setFieldErrors(newFieldErrors);
            return;
        }

        setFieldErrors({});

        try {
            await createUser({ username, email: email as TEmail, password });
            cleanForms();
            navigate('/login');
        } catch (error) {
            const serverErrors = getValidationErrors(error);
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
                setError('Erro ao registrar. Tente novamente.');
            }
        }
    };

    return (
        <section className={styles.container}>
            <h2>Register</h2>

            <form onSubmit={handleSubmit}>
                <fieldset>
                    <label htmlFor={usernameInputId}>Username:</label>
                    <input
                        id={usernameInputId}
                        type="text"
                        required
                        maxLength={25}
                        onChange={e => setUsername(e.target.value)}
                    />
                    {fieldErrors.username ? (
                        <p className={styles['error-msg']}>{fieldErrors.username}</p>
                    ) : null}
                </fieldset>

                <fieldset>
                    <label htmlFor={emailInputId}>E-mail:</label>
                    <input
                        id={emailInputId}
                        type="email"
                        placeholder="example@foo.bar"
                        required
                        onChange={e => setEmail(e.target.value)}
                    />
                    {fieldErrors.email ? (
                        <p className={styles['error-msg']}>{fieldErrors.email}</p>
                    ) : null}
                </fieldset>

                <fieldset>
                    <label htmlFor={passwordInputId}>Password:</label>
                    <PasswordInput
                        id={passwordInputId}
                        onChange={e => setPassword(e.target.value)}
                    />
                    {fieldErrors.password ? (
                        <p className={styles['error-msg']}>{fieldErrors.password}</p>
                    ) : null}
                </fieldset>

                <button type="submit">Sign-up</button>
                <p>
                    Already have an account? <Link to="/login">Log in</Link>.
                </p>
                {error ? <p className={styles['error-msg']}>{error}</p> : null}
            </form>
        </section>
    );
}
