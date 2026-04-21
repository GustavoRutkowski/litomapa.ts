export default interface IModal {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}
