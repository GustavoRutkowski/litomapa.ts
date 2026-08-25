import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Header from '../../components/common/Header/Header';

import ThreadHeaderCard from '../../components/features/thread/ThreadHeaderCard/ThreadHeaderCard';
import ThreadMessageList, {
    IMessage
} from '../../components/features/thread/ThreadMessageList/ThreadMessageList';
import ThreadMessageInput from '../../components/features/thread/ThreadMessageInput/ThreadMessageInput';

import useThreads from '../../hooks/useThreads';
import useUserInfos from '../../hooks/useUserInfos';
import type { MessageDTO, ThreadDTO } from '../../services/threads.service';
import Formatter from '../../utils/Formatter';

import styles from './Thread.module.scss';

export const MESSAGE_REFRESH_INTERVAL_MS = 500;

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

    const { getThread, getMessages, sendMessage } = useThreads();
    const { user } = useUserInfos();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [messageContent, setMessageContent] = useState('');
    const [replyingTo, setReplyingTo] = useState<IMessage | null>(null);
    const [isSending, setIsSending] = useState(false);

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

    useEffect(() => {
        if (!Number.isFinite(parsedId) || isSending) return;

        let mounted = true;

        const refreshMessages = async () => {
            try {
                const response = await getMessages(parsedId);
                if (mounted) setMessages(response.map(message => toMessageView(message, user?.id)));
            } catch {
                // Keep the messages already rendered when a refresh fails.
            }
        };

        const intervalId = window.setInterval(() => {
            void refreshMessages();
        }, MESSAGE_REFRESH_INTERVAL_MS);

        return () => {
            mounted = false;
            window.clearInterval(intervalId);
        };
    }, [getMessages, isSending, parsedId, user?.id]);

    const handleSendMessage = async () => {
        const content = messageContent.trim();
        if (!content || !user?.id || !Number.isFinite(parsedId) || isSending) return;

        const temporaryId = -Date.now();
        const optimisticMessage: IMessage = {
            id: temporaryId,
            author: user.username ?? 'Você',
            authorPicture: Formatter.formatPicture(user.photo),
            createdAt: new Date().toLocaleString('pt-BR'),
            message: content,
            mine: true,
            replying: replyingTo
                ? {
                      id: replyingTo.id,
                      author: replyingTo.author,
                      message: replyingTo.message
                  }
                : null
        };
        const replyId = replyingTo?.id ?? null;

        setMessages(current => [...current, optimisticMessage]);
        setMessageContent('');
        setReplyingTo(null);
        setIsSending(true);

        try {
            const insertId = await sendMessage(parsedId, content, replyId);
            setMessages(current =>
                current.map(message =>
                    message.id === temporaryId ? { ...message, id: insertId } : message
                )
            );
        } catch {
            setMessages(current => current.filter(message => message.id !== temporaryId));
            setMessageContent(content);
        } finally {
            setIsSending(false);
        }
    };

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

                        <ThreadMessageList messages={messages} onReply={setReplyingTo} />
                        {replyingTo && (
                            <div className={styles.replyingBar}>
                                <span>
                                    Respondendo a <strong>{replyingTo.author}</strong>: “
                                    {replyingTo.message}”
                                </span>
                                <button type="button" onClick={() => setReplyingTo(null)}>
                                    Cancelar
                                </button>
                            </div>
                        )}
                        <ThreadMessageInput
                            value={messageContent}
                            onChange={setMessageContent}
                            onSend={() => void handleSendMessage()}
                            disabled={isSending || !user}
                        />
                    </section>
                </div>
            </main>
        </div>
    );
}
