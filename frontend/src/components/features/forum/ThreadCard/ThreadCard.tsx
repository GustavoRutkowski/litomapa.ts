import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

import styles from './ThreadCard.module.scss';
import ThreadVote from '../ThreadVote/ThreadVote';

interface IThreadTag {
    label: string;
    color?: string;
}

interface IProps {
    author: string;
    authorPicture: string;
    title: string;
    description: string;
    tags: IThreadTag[];
    createdAt: string;
    location: string;
    upvotes: number;
}

export default function ThreadCard({
    author,
    authorPicture,
    title,
    description,
    tags,
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

                <div className={styles.tags}>
                    {tags.map(tag => (
                        <span
                            key={tag.label}
                            className={styles.tag}
                            style={
                                tag.color
                                    ? {
                                          backgroundColor: `${tag.color}20`,
                                          color: tag.color
                                      }
                                    : undefined
                            }
                        >
                            {tag.label}
                        </span>
                    ))}
                </div>

                <h2>{title}</h2>
                <p>{description}</p>
            </section>
        </article>
    );
}
