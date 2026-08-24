import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Header from '../../components/common/Header/Header';

import ThreadHeaderCard from '../../components/features/thread/ThreadHeaderCard/ThreadHeaderCard';
import ThreadMessageList, {
    IMessage
} from '../../components/features/thread/ThreadMessageList/ThreadMessageList';

import useThreads from '../../hooks/useThreads';
import useUserInfos from '../../hooks/useUserInfos';
import type { MessageDTO, ThreadDTO } from '../../services/threads.service';
import Formatter from '../../utils/Formatter';

import styles from './Thread.module.scss';

const toMessageView = (message: MessageDTO, currentUserId?: number): IMessage => ({
    id: message.id,
    author: message.author.username,
    authorPicture: Formatter.formatPicture(message.author.photo),
    createdAt: message.createdAt ? new Date(message.createdAt).toLocaleString('pt-BR') : '',
    message: message.content,
    mine: message.author.id === currentUserId,
    replying: message.replying
        ? {
              id: message.replying.id,
              author: message.replying.author.username,
              message: message.replying.content
          }
        : null
});

export default function Thread() {
    const { id } = useParams();

    const parsedId = Number(id);

    const { getThread, getMessages } = useThreads();
    const { user } = useUserInfos();
    const [messages, setMessages] = useState<IMessage[]>([]);

    const [thread, setThread] = useState<ThreadDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function loadThread() {
            if (!Number.isFinite(parsedId)) {
                setThread(null);
                setIsLoading(false);
                return;
            }

            try {
                const [threadResponse, messageResponse] = await Promise.all([
                    getThread(parsedId),
                    getMessages(parsedId)
                ]);
                if (!mounted) return;
                setThread(threadResponse);
                setMessages(messageResponse.map(message => toMessageView(message, user?.id)));
            } catch {
                if (mounted) setThread(null);
            } finally {
                if (mounted) setIsLoading(false);
            }
        }

        void loadThread();
        return () => {
            mounted = false;
        };
    }, [getMessages, getThread, parsedId, user?.id]);

    if (isLoading) {
        return (
            <div className={styles.page}>
                <Header />

                <main className={styles.main}>
                    <p>Carregando thread...</p>
                </main>
            </div>
        );
    }

    if (!thread) {
        return (
            <div className={styles.page}>
                <Header />

                <main className={styles.main}>
                    <p>Thread não encontrada.</p>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <Header />

            <main className={styles.main}>
                <div className={styles.layout}>
                    <ThreadHeaderCard thread={thread} />

                    <section className={styles.chatPanel} aria-label="Chat da thread">
                        <header className={styles.chatHeader}>
                            <div className={styles.chatTitle}>
                                <strong>Bate-papo da thread</strong>
                                <span>Discussão em tempo real</span>
                            </div>

                            <span className={styles.chatMeta}>{messages.length} mensagens</span>
                        </header>

                        <ThreadMessageList messages={messages} />
                    </section>
                </div>
            </main>
        </div>
    );
}
