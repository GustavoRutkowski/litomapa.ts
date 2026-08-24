import ThreadMessage from '../ThreadMessage/ThreadMessage';

import styles from './ThreadMessageList.module.scss';

export interface IMessage {
    id: number;

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
}

interface IProps {
    messages: IMessage[];
    isLoadingOlderMessages?: boolean;
    onReply?: (message: IMessage) => void;
}

export default function ThreadMessageList({
    messages,
    isLoadingOlderMessages = false,
    onReply
}: IProps) {
    return (
        <section className={styles.container}>
            {isLoadingOlderMessages && (
                <div className={styles.loading}>Carregando mensagens...</div>
            )}

            {messages.map((message, index) => {
                const previous = messages[index - 1];

                const showAuthor = !previous || previous.author !== message.author;

                return (
                    <ThreadMessage
                        key={message.id}
                        author={message.author}
                        authorPicture={message.authorPicture}
                        message={message.message}
                        replying={message.replying}
                        createdAt={message.createdAt}
                        mine={message.mine}
                        showAuthor={showAuthor}
                        onReply={onReply ? () => onReply(message) : undefined}
                    />
                );
            })}
        </section>
    );
}
