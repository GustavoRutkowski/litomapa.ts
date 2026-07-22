import { createContext } from 'react';

interface IModalContextType {
    onClose: () => void;
}

const ModalContext = createContext<IModalContextType | null>(null);
export default ModalContext;
