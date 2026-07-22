import { useContext } from 'react';
import ModalContext from '../contexts/ModalContext';

export default function useModal() {
    const context = useContext(ModalContext);
    if (!context) throw new Error('useModal must be used inside a Modal');
    return context;
}
