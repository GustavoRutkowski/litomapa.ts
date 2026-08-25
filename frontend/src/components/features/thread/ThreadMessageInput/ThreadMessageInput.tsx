import { useEffect, useRef } from 'react';

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
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const wasDisabledRef = useRef(disabled);

    useEffect(() => {
        if (wasDisabledRef.current && !disabled) {
            inputRef.current?.focus();
        }

        wasDisabledRef.current = disabled;
    }, [disabled]);

    return (
        <div className={styles.container}>
            <textarea
                ref={inputRef}
                rows={1}
                value={value}
                placeholder="Escreva uma mensagem..."
                onChange={event => onChange?.(event.target.value)}
                onKeyDown={event => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        onSend?.();
                    }
                }}
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
