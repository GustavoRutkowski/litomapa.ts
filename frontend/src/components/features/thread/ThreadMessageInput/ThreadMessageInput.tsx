import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import styles from './ThreadMessageInput.module.scss';

interface IProps {
    value?: string;
    onChange?: (value: string) => void;
    onSend?: () => void;
    disabled?: boolean;
}

export default function ThreadMessageInput({
    value = '',
    onChange,
    onSend,
    disabled = false
}: IProps) {
    return (
        <div className={styles.container}>
            <textarea
                rows={1}
                value={value}
                placeholder="Escreva uma mensagem..."
                onChange={event => onChange?.(event.target.value)}
                disabled={disabled}
            />

            <button
                type="button"
                onClick={onSend}
                aria-label="Enviar mensagem"
                title="Enviar mensagem"
                disabled={disabled}
            >
                <FontAwesomeIcon icon={faPaperPlane} />
            </button>
        </div>
    );
}
