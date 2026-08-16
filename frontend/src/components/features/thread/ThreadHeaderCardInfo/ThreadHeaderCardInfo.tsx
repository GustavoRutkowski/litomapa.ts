import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './ThreadHeaderCardInfo.module.scss';

interface IProps {
    icon: IconDefinition;
    title: string;
    content: string;
}

export default function ThreadHeaderCardInfo({ icon, title, content }: IProps) {
    return (
        <div className={styles.container}>
            <FontAwesomeIcon icon={icon} />

            <div>
                <strong>{title}</strong>
                <span>{content}</span>
            </div>
        </div>
    );
}
