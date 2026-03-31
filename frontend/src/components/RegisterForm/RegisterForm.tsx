import React, { useEffect, useId, useState } from 'react';
import FormBox from '../FormBox/FormBox';
import { Link, useNavigate } from 'react-router-dom';
import useUsers from '../../hooks/useUsers';
import TEmail from '../../types/TEmail';

import styles from '../FormBox/FormBox.module.scss';
import PasswordInput from '../PasswordInput/PasswordInput';

export default function RegisterForm() {
    const usernameInputId = useId();
    const emailInputId = useId();
    const passwordInputId = useId();
    const navigate = useNavigate();

    const { createUser } = useUsers();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string|null>(null);

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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
            setError('Formato de e-mail inválido!');
            return;
        }
        if (email && isValid && error) setError(null);
    }, [email]);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!username || !email || !password) {
            setError('Todos os campos são obrigatórios.');
            return;
        }
        if (error) return;
        
        try {
            await createUser({ username, email: email as TEmail, password });
            cleanForms();
            navigate('/login');
        } catch (e) {
            setError('Erro ao registrar. Tente novamente.');
        }
    };
    
    return (
        <FormBox title='Register' onSubmit={handleSubmit}>
            <fieldset>
                <label htmlFor={usernameInputId}>Username:</label>
                <input
                    id={usernameInputId}
                    type="text"
                    required maxLength={25}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </fieldset>
            
            <fieldset>
                <label htmlFor={emailInputId}>E-mail:</label>
                <input
                    id={emailInputId}
                    type="email"
                    placeholder="example@foo.bar" required
                    onChange={(e) => setEmail(e.target.value)}
                />
            </fieldset>

            <fieldset>
                <label htmlFor={passwordInputId}>Password:</label>
                <PasswordInput
                    id={passwordInputId}
                    onChange={e => setPassword(e.target.value)}
                />
            </fieldset>

            <button type="submit">Sign-up</button>
            <p>Already have an account? <Link to="/login">Log in</Link>.</p>
            <p className={styles['error-msg']}>{error}</p>
        </FormBox>
    );
}
