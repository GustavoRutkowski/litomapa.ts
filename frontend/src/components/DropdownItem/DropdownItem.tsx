import { MouseEventHandler } from 'react';

interface IProps {
    title?: string;
    onClick?: MouseEventHandler;
}

export default function DropdownItem({ title, onClick }: IProps = {}) {
    return (
        <li>
            <button type="button" onClick={onClick}>
                {title}
            </button>
        </li>
    );
}
