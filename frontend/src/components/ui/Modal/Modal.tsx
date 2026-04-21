import { ReactNode, useEffect, useRef, createContext, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import IModal from '../../../types/IModal';

import styles from './Modal.module.scss';

interface IModalContextType {
    onClose: () => void;
}

const ModalContext = createContext<IModalContextType | null>(null);

function Modal({ open, onClose, children }: IModal) {
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
        <ModalContext.Provider value={{ onClose }}>
            <dialog
                ref={dialogRef}
                className={styles.container}
                aria-modal="true"
                aria-label="Modal"
            >
                <section>{children}</section>
            </dialog>
        </ModalContext.Provider>
    );
}

Modal.CloseButton = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error('Modal.CloseButton deve ser usado dentro de um Modal');

    return (
        <button
            type="button"
            className={styles['close-button']}
            aria-label="Fechar modal"
            onClick={context.onClose}
        >
            <FontAwesomeIcon icon={faTimes} />
        </button>
    );
};

interface IChildren {
    children: ReactNode;
}
Modal.Header = ({ children }: IChildren) => <header className={styles.header}>{children}</header>;
Modal.Title = ({ children }: IChildren) => <h2 className={styles.title}>{children}</h2>;
Modal.Body = ({ children }: IChildren) => <div className={styles.body}>{children}</div>;

export default Modal;
