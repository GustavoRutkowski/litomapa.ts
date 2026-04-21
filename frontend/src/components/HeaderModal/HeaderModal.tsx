import IModal from '../../types/IModal';
import Modal from '../Modal/Modal';

interface IProps extends IModal {
    title: string;
}

export default function HeaderModal({ open, onClose, title, children }: IProps) {
    return (
        <Modal open={open} onClose={onClose}>
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
                <Modal.CloseButton />
            </Modal.Header>

            <Modal.Body>{children}</Modal.Body>
        </Modal>
    );
}
