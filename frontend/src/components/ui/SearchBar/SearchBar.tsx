import { ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import styles from './SearchBar.module.scss';

interface IProps {
    value?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
}

export default function SearchBar({ value = '', placeholder = 'Pesquisar...', onChange }: IProps) {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => onChange?.(event.target.value);

    return (
        <div className={styles.container}>
            <FontAwesomeIcon icon={faSearch} className={styles.icon} />

            <input type="search" value={value} placeholder={placeholder} onChange={handleChange} />
        </div>
    );
}
