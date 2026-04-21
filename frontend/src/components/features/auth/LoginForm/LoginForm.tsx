import { useContext, useEffect, useId, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TEmail from '../../../../types/TEmail';
import { AuthContext } from '../../../../contexts/AuthContext';
import useAuth from '../../../../hooks/useAuth';
import PasswordInput from '../../../ui/PasswordInput/PasswordInput';

import styles from './LoginForm.module.scss';

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

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const cleanForms = () => {
        setEmail('');
        setPassword('');
        setError(null);
    };

    useEffect(() => {
        const isValid = isValidEmail(email);
        if (email && !isValid) {
            setError('Formato de e-mail inválido!');
            return;
        }
        if (email && isValid && error) setError(null);
    }, [email]);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Todos os campos são obrigatórios.');
            return;
        }
        if (error) return;

        try {
            await login({ email: email as TEmail, password });
            cleanForms();
            navigate('/dashboard');
        } catch {
            setError('Erro no login. Tente novamente.');
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
                </fieldset>

                <fieldset>
                    <label htmlFor={passwordInputId}>Password:</label>
                    <PasswordInput
                        id={passwordInputId}
                        onChange={e => setPassword(e.target.value)}
                    />
                </fieldset>

                <button type="submit">Sign-in</button>
                <p>
                    Don't have an account? <Link to="/register">Sign up</Link>.
                </p>
                <p className={styles['error-msg']}>{error}</p>
            </form>
        </section>
    );
}
