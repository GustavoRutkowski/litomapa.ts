import { useContext, useEffect, useId, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TEmail from '../../../../types/TEmail';
import { AuthContext } from '../../../../contexts/AuthContext';
import useAuth from '../../../../hooks/useAuth';
import PasswordInput from '../../../ui/PasswordInput/PasswordInput';

import styles from './LoginForm.module.scss';

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

const isValidEmailFormat = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password: string): string | null => {
    if (password.length < 8) return 'Senha deve ter ao menos 8 caracteres.';
    if (!/[a-z]/.test(password)) return 'Senha deve conter ao menos uma letra minúscula.';
    if (!/[A-Z]/.test(password)) return 'Senha deve conter ao menos uma letra maiúscula.';
    if (!/[0-9]/.test(password)) return 'Senha deve conter ao menos um número.';
    if (!/[^a-zA-Z0-9]/.test(password)) return 'Senha deve conter ao menos um caractere especial.';
    return null;
};

export default function LoginForm() {
    const emailInputId = useId();
    const passwordInputId = useId();
    const navigate = useNavigate();

    const context = useContext(AuthContext);
    if (context === null) throw new Error('AuthProvider not found');

    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});

    const cleanForms = () => {
        setEmail('');
        setPassword('');
        setError(null);
    };

    useEffect(() => {
        if (!email) return;
        if (!isValidEmailFormat(email)) {
            setFieldErrors(prev => ({ ...prev, email: 'Formato de e-mail inválido!' }));
            return;
        }
        setFieldErrors(prev => ({ ...prev, email: null }));
    }, [email]);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        // client-side validation aligned with backend
        const newFieldErrors: Record<string, string | null> = {};

        if (!isValidEmailFormat(email)) newFieldErrors.email = 'Formato de e-mail inválido!';

        const pw = validatePassword(password);
        if (pw) newFieldErrors.password = pw;

        if (Object.keys(newFieldErrors).length > 0) {
            setFieldErrors(newFieldErrors);
            return;
        }

        setFieldErrors({});

        try {
            await login({ email: email as TEmail, password });
            cleanForms();
            navigate('/dashboard');
        } catch (e) {
            const serverErrors = getValidationErrors(e);

            if (!serverErrors) {
                setError('Erro no login. Tente novamente.');
                return;
            }

            const mapped: Record<string, string | null> = {};

            if (Array.isArray(serverErrors.global) && serverErrors.global.length > 0) {
                setError(serverErrors.global[0]);
            }

            for (const key of Object.keys(serverErrors)) {
                if (key === 'global') continue;
                const arr = serverErrors[key];
                if (Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'string')
                    mapped[key] = arr[0];
            }

            setFieldErrors(mapped);
        }
    };

    return (
        <section className={styles.container}>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
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

                <button type="submit">Sign-in</button>
                <p>
                    Don't have an account? <Link to="/register">Sign up</Link>.
                </p>
                {error ? <p className={styles['error-msg']}>{error}</p> : null}
            </form>
        </section>
    );
}
