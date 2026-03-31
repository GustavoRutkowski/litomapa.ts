import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEventHandler, useState } from 'react';

import styles from './PasswordInput.module.scss';

interface IProps {
    id?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
}

export default function PasswordInput({ id, onChange }: IProps = {}) {
    const [showPassword, setShowPassword] = useState(false);
    const toggleVisibility = () => setShowPassword(!showPassword);

    return (
        <div className={styles.container}>
            <input
                className={styles.input}
                id={id}
                type={showPassword ? 'text' : 'password'}
                placeholder='Digite sua senha'
                required
                onChange={onChange}
            />
            
            <button type="button" onClick={toggleVisibility}>
                <FontAwesomeIcon className={styles.icon} icon={showPassword ? faEyeSlash : faEye} />
            </button>
        </div>
    );
}
