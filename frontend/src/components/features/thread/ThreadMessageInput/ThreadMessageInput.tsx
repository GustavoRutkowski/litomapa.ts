import { useEffect, useRef, type ChangeEvent } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';

import styles from './ThreadMessageInput.module.scss';

interface IProps {
    value?: string;
    onChange?: (value: string) => void;
    onSend?: () => void;
    attachments?: string[];
    onAttachmentsChange?: (attachments: string[]) => void;
    disabled?: boolean;
}

const MAX_ATTACHMENTS = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

export default function ThreadMessageInput({
    value = '',
    onChange,
    onSend,
    attachments = [],
    onAttachmentsChange,
    disabled = false
}: IProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const wasDisabledRef = useRef(disabled);

    useEffect(() => {
        if (wasDisabledRef.current && !disabled) {
            textareaRef.current?.focus();
        }

        wasDisabledRef.current = disabled;
    }, [disabled]);

    const handleAttachments = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        event.target.value = '';

        const availableSlots = MAX_ATTACHMENTS - attachments.length;
        if (availableSlots <= 0) return;

        const validFiles = files
            .filter(file => IMAGE_TYPES.includes(file.type) && file.size <= MAX_IMAGE_SIZE)
            .slice(0, availableSlots);

        Promise.all(
            validFiles.map(
                file =>
                    new Promise<string>(resolve => {
                        const reader = new FileReader();
                        reader.onload = () =>
                            resolve(typeof reader.result === 'string' ? reader.result : '');
                        reader.onerror = () => resolve('');
                        reader.readAsDataURL(file);
                    })
            )
        ).then(results => {
            const newAttachments = results.filter(Boolean);
            onAttachmentsChange?.([...attachments, ...newAttachments].slice(0, MAX_ATTACHMENTS));
        });
    };

    return (
        <div className={styles.container}>
            {attachments.length > 0 && (
                <div className={styles.previewList}>
                    {attachments.map((attachment, index) => (
                        <div className={styles.preview} key={`${attachment}-${index}`}>
                            <img src={attachment} alt={`Anexo ${index + 1}`} />
                            <button
                                type="button"
                                onClick={() =>
                                    onAttachmentsChange?.(attachments.filter((_, i) => i !== index))
                                }
                                aria-label={`Remover anexo ${index + 1}`}
                                title="Remover imagem"
                                disabled={disabled}
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                multiple
                onChange={handleAttachments}
                hidden
            />

            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                aria-label="Adicionar imagem"
                title="Adicionar imagem"
                disabled={disabled || attachments.length >= MAX_ATTACHMENTS}
            >
                <FontAwesomeIcon icon={faImage} />
            </button>

            <textarea
                ref={textareaRef}
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
