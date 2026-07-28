import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './ThreadVote.module.scss';

interface IProps {
    upvotes: number;
}

export default function ThreadVote({ upvotes }: IProps) {
    return (
        <aside className={styles.container}>
            <button type="button" aria-label="Upvote">
                <FontAwesomeIcon icon={faChevronUp} />
            </button>

            <span>{upvotes}</span>

            <button type="button" aria-label="Downvote">
                <FontAwesomeIcon icon={faChevronDown} />
            </button>
        </aside>
    );
}
