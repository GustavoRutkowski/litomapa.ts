import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Box from '../Box/Box';
import styles from './Modal.module.scss';

interface IProps {
    open: boolean;
    title?: string;
    children?: React.ReactNode;
    onClose: () => void;
}

export default function Modal({ open, title, children, onClose }: IProps) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        if (!open || !dialogRef.current) return;

        const dialog = dialogRef.current;
        const supportsShowModal = typeof dialog.showModal === 'function';

        const handleCancel = (e: Event) => {
            e.preventDefault();
            onClose();
        };

        if (supportsShowModal) {
            dialog.showModal();
            dialog.addEventListener('cancel', handleCancel);
            return () => {
                dialog.removeEventListener('cancel', handleCancel);
                if (dialog.open) dialog.close();
            };
        }

        const handleEsc = (e: KeyboardEvent) => {
            if (!supportsShowModal && e.key === 'Escape') onClose();
        };

        dialog.setAttribute('open', '');
        dialog.addEventListener('cancel', handleCancel);
        document.addEventListener('keydown', handleEsc);
        return () => {
            dialog.removeEventListener('cancel', handleCancel);
            document.removeEventListener('keydown', handleEsc);
            if (dialog.open) dialog.close();
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <dialog
            ref={dialogRef}
            className={styles.container}
            aria-modal="true"
            aria-label={title ?? 'Modal'}
        >
            <Box title={title}>
                <button
                    type="button"
                    className={styles['close-button']}
                    aria-label="Fechar modal"
                    onClick={onClose}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                {children}
            </Box>
        </dialog>
    );
}
