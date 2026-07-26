import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import styles from './Popup.module.scss';

type PopupType = 'success' | 'error';

interface IProps {
    type: PopupType;
    message: string;
    timeout: number;
    onClose?: () => void;
}

export default function Popup({ type, message, timeout, onClose }: IProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setVisible(false);
            onClose?.();
        }, timeout);

        return () => window.clearTimeout(timer);
    }, [timeout, onClose]);

    if (!visible) return null;

    return (
        <div className={`${styles.container} ${styles[type]}`} role="status" aria-live="polite">
            <FontAwesomeIcon icon={type === 'success' ? faCheckCircle : faCircleExclamation} />
            <span>{message}</span>
        </div>
    );
}
