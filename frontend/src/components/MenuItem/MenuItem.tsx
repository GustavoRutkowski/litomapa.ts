import IMenuItem from '../../types/IMenuItem';

export default function MenuItem({ title, onClick }: IMenuItem) {
    return (
        <li>
            <button type="button" onClick={onClick}>
                {title}
            </button>
        </li>
    );
}
