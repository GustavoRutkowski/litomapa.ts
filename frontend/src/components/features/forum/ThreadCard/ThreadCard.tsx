import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

import styles from './ThreadCard.module.scss';
import ThreadVote from '../ThreadVote/ThreadVote';
import { ThreadDTO } from '../../../../services/threads.service';
import Formatter from '../../../../utils/Formatter';
import { useEffect, useState } from 'react';

interface IProps {
    thread: ThreadDTO;
}

export default function ThreadCard({ thread }: IProps) {
    const relativeDate = Formatter.relativeDateFrom(new Date(thread.createdAt));
    const [address, setAddress] = useState<string | undefined>();

    useEffect(() => {
        Formatter.addressFrom(thread.coords.latitude, thread.coords.longitude).then(setAddress);
    }, []);

    return (
        <article className={styles.container}>
            <ThreadVote upvotes={0} />

            <section className={styles.content}>
                <header className={styles.header}>
                    <div className={styles.author}>
                        <img
                            src={Formatter.formatPicture(thread.author.photo)}
                            alt={`Foto de ${thread.author.username}`}
                        />
                        <span>{thread.author.username}</span>
                    </div>

                    <span className={styles.date}>{relativeDate}</span>
                </header>

                <div className={styles.location}>
                    <FontAwesomeIcon icon={faLocationDot} />
                    <span>{address}</span>
                </div>

                <div className={styles.tags}>
                    {thread.tags.map(tag => (
                        <span key={tag} className={styles.tag}>
                            {tag}
                        </span>
                    ))}
                </div>

                <h2>{thread.title}</h2>
                <p>{thread.description}</p>
            </section>
        </article>
    );
}
