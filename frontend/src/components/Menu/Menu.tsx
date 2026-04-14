import IMenuItem from '../../types/IMenuItem';
import Box from '../Box/Box';
import MenuItem from '../MenuItem/MenuItem';

interface IProps {
    open: boolean;
    items: IMenuItem[];
}

export default function Menu({ open, items = [] }: IProps) {
    if (!open) return null;

    return (
        <Box>
            <ul>
                {items.map(({ title, onClick }) => (
                    <MenuItem key={crypto.randomUUID()} title={title} onClick={onClick} />
                ))}
            </ul>
        </Box>
    );
}
