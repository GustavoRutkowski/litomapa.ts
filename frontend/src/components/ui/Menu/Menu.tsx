import { createContext, useContext } from 'react';

interface IProps {
    open?: boolean;
    activeClass?: string;
    children: React.ReactNode;
}

const ActiveClassContext = createContext<string | null>(null);

function Menu({ open = true, activeClass, children }: IProps) {
    if (!open) return null;
    return (
        <ul>
            <ActiveClassContext.Provider value={activeClass || null}>
                {children}
            </ActiveClassContext.Provider>
        </ul>
    );
}

interface IMenuProps {
    active?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
}

Menu.Item = ({ active = false, onClick, children }: IMenuProps) => {
    const activeClass = useContext(ActiveClassContext);

    return (
        <li key={crypto.randomUUID()}>
            <button
                className={active && activeClass ? activeClass : ''}
                type="button"
                onClick={onClick}
            >
                {children}
            </button>
        </li>
    );
};

export default Menu;
