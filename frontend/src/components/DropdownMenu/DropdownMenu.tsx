import IDropdownItem from '../../types/IDropdownItem';
import Box from '../Box/Box';
import DropdownItem from '../DropdownItem/DropdownItem';

interface IProps {
    open: boolean;
    items: IDropdownItem[];
}

export default function DropdownMenu({ open, items = [] }: IProps) {
    if (!open) return null;

    return (
        <Box>
            <ul>
                {items.map(({ title, onClick }) => (
                    <DropdownItem key={crypto.randomUUID()} title={title} onClick={onClick} />
                ))}
            </ul>
        </Box>
    );
}
