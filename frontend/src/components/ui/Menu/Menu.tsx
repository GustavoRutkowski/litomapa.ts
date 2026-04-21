interface IProps {
    open: boolean;
    children: React.ReactNode;
}

function Menu({ open = true, children }: IProps) {
    if (!open) return null;
    return <ul>{children}</ul>;
}

interface IMenuProps {
    onClick?: () => void;
    children: React.ReactNode;
}

Menu.Item = ({ onClick, children }: IMenuProps) => {
    return (
        <li key={crypto.randomUUID()}>
            <button type="button" onClick={onClick}>
                {children}
            </button>
        </li>
    );
};

export default Menu;
