import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

import styles from './ThreadCard.module.scss';
import ThreadVote from '../ThreadVote/ThreadVote';

interface IProps {
    author: string;
    authorPicture: string;
    title: string;
    description: string;
    createdAt: string;
    location: string;
    upvotes: number;
}

export default function ThreadCard({
    author,
    authorPicture,
    title,
    description,
    createdAt,
    location,
    upvotes
}: IProps) {
    return (
        <article className={styles.container}>
            <ThreadVote upvotes={upvotes} />

            <section className={styles.content}>
                <header className={styles.header}>
                    <div className={styles.author}>
                        <img src={authorPicture} alt={`Foto de ${author}`} />
                        <span>{author}</span>
                    </div>

                    <span className={styles.date}>{createdAt}</span>
                </header>

                <div className={styles.location}>
                    <FontAwesomeIcon icon={faLocationDot} />
                    <span>{location}</span>
                </div>

                <h2>{title}</h2>
                <p>{description}</p>
            </section>
        </article>
    );
}
