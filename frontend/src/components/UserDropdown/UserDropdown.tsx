import Box from '../Box/Box';
import styles from './UserDropdown.module.scss';
import DropdownItem from '../DropdownItem/DropdownItem';

interface IProps {
    open?: boolean;
}

export default function UserDropdown({ open }: IProps = {}) {
    if (!open) return null;

    return (
        <div className={styles.container}>
            <Box>
                <ul>
                    <DropdownItem title="Perfil" />
                    <DropdownItem title="Mudar Senha" />
                    <DropdownItem title="Notificações" />
                    <DropdownItem title="Sair" />
                </ul>
            </Box>
        </div>
    );
}
