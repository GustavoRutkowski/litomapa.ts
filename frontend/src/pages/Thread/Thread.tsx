import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/common/Header/Header';
import useThreads from '../../hooks/useThreads';
import type { ThreadDTO } from '../../services/threads.service';
import defaultUserPicture from '../../assets/default-picture.png';
import styles from './Thread.module.scss';

export default function Thread() {
    const { id } = useParams();
    const { getThread } = useThreads();
    const [thread, setThread] = useState<ThreadDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const parsedId = Number(id);

    useEffect(() => {
        let isMounted = true;

        const loadThread = async () => {
            if (!Number.isFinite(parsedId)) {
                if (isMounted) {
                    setThread(null);
                    setIsLoading(false);
                }
                return;
            }

            try {
                const response = await getThread(parsedId);
                if (!isMounted) return;
                setThread(response);
            } catch {
                if (isMounted) {
                    setThread(null);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadThread();

        return () => {
            isMounted = false;
        };
    }, [getThread, parsedId]);

    return (
        <div className={styles.page}>
            <Header />
            <main className={styles.main}>
                <section className={styles.card}>
                    {isLoading ? (
                        <p className={styles.status}>Carregando thread...</p>
                    ) : !thread ? (
                        <p className={styles.status}>Thread não encontrada.</p>
                    ) : (
                        <>
                            <div className={styles.headerRow}>
                                <div>
                                    <p className={styles.eyebrow}>Registro selecionado</p>
                                    <h1 className={styles.title}>{thread.title}</h1>
                                </div>
                                <div className={styles.authorBox}>
                                    <img
                                        className={styles.avatar}
                                        src={thread.author.photo || defaultUserPicture}
                                        alt={thread.author.username}
                                    />
                                    <span className={styles.authorName}>
                                        {thread.author.username}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.grid}>
                                <div className={styles.infoBlock}>
                                    <span className={styles.label}>Espécie</span>
                                    <strong>{thread.species[0].name}</strong>
                                </div>
                                <div className={styles.infoBlock}>
                                    <span className={styles.label}>Tags</span>
                                    <div className={styles.tags}>
                                        {(thread.tags ?? []).map(tag => (
                                            <span key={crypto.randomUUID()} className={styles.tag}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.infoBlock}>
                                    <span className={styles.label}>Localização</span>
                                    <strong>
                                        {thread.coords.latitude.toFixed(4)},{' '}
                                        {thread.coords.longitude.toFixed(4)}
                                    </strong>
                                </div>
                            </div>

                            <p className={styles.helper}>
                                Esta página é uma visualização provisória da thread escolhida no
                                mapa.
                            </p>
                        </>
                    )}
                </section>
            </main>
        </div>
    );
}
