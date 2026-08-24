import styles from './ThreadMessage.module.scss';

interface IProps {
    author: string;
    authorPicture: string;
    message: string;
    replying?: {
        id: number;
        author: string;
        message: string;
    } | null;
    createdAt: string;
    mine?: boolean;
    showAuthor?: boolean;
}

export default function ThreadMessage({
    author,
    authorPicture,
    message,
    replying,
    createdAt,
    mine = false,
    showAuthor = true
}: IProps) {
    const className = [styles.container, mine ? styles.mine : ''].filter(Boolean).join(' ');

    return (
        <article className={className}>
            {!mine && (
                <img className={styles.avatar} src={authorPicture} alt={`Foto de ${author}`} />
            )}

            <div className={styles.content}>
                {showAuthor && (
                    <header className={styles.header}>
                        <span className={styles.author}>{author}</span>
                        {createdAt && <span className={styles.date}>{createdAt}</span>}
                    </header>
                )}

                <div className={styles.bubble}>
                    {replying && (
                        <div className={styles.reply}>
                            <strong>{replying.author}</strong>
                            <span>{replying.message}</span>
                        </div>
                    )}
                    <div>{message}</div>
                </div>
            </div>

            {mine && (
                <img className={styles.avatar} src={authorPicture} alt={`Foto de ${author}`} />
            )}
        </article>
    );
}
