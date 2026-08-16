import { faCalendarDays, faLocationDot, faPaw } from '@fortawesome/free-solid-svg-icons';

import ThreadVote from '../../forum/ThreadVote/ThreadVote';

import styles from './ThreadHeaderCard.module.scss';
import { ThreadDTO } from '../../../../services/threads.service';
import Formatter from '../../../../utils/Formatter';
import { useEffect, useState } from 'react';
import ThreadHeaderCardInfo from '../ThreadHeaderCardInfo/ThreadHeaderCardInfo';

interface IProps {
    thread: ThreadDTO;
}

export default function ThreadHeaderCard({ thread }: IProps) {
    const [address, setAddress] = useState<string>();

    useEffect(() => {
        if (!thread) return;

        Formatter.addressFrom(thread.coords.latitude, thread.coords.longitude).then(setAddress);
    }, [thread]);

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

                        <div>
                            <span>{thread.author.username}</span>
                            <small>{Formatter.relativeDateFrom(new Date(thread.createdAt))}</small>
                        </div>
                    </div>
                </header>

                <h1>{thread.title}</h1>
                <p>{thread.description}</p>

                <div className={styles.tags}>
                    {thread.tags.map(tag => (
                        <span key={tag} className={styles.tag}>
                            {tag}
                        </span>
                    ))}
                </div>

                <div className={styles.infoGrid}>
                    <ThreadHeaderCardInfo
                        icon={faLocationDot}
                        title="Localização"
                        content={address || ''}
                    />
                    <ThreadHeaderCardInfo
                        icon={faLocationDot}
                        title="Coordenadas"
                        content={[
                            thread.coords.latitude.toFixed(6),
                            thread.coords.longitude.toFixed(6)
                        ].join(', ')}
                    />
                    <ThreadHeaderCardInfo
                        icon={faPaw}
                        title="Espécie"
                        content={thread.species[0].name}
                    />
                    <ThreadHeaderCardInfo
                        icon={faCalendarDays}
                        title="Ocorrido em"
                        content={new Date(thread.createdAt).toLocaleString('pt-BR')}
                    />
                </div>
            </section>
        </article>
    );
}
