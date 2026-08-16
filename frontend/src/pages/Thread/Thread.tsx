import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Header from '../../components/common/Header/Header';

import ThreadHeaderCard from '../../components/features/thread/ThreadHeaderCard/ThreadHeaderCard';
import ThreadMessageList, {
    IMessage
} from '../../components/features/thread/ThreadMessageList/ThreadMessageList';
import ThreadMessageInput from '../../components/features/thread/ThreadMessageInput/ThreadMessageInput';

import useThreads from '../../hooks/useThreads';
import type { ThreadDTO } from '../../services/threads.service';

import defaultPictureUrl from '@/assets/default-picture.png';

import styles from './Thread.module.scss';

const MOCK_MESSAGES: IMessage[] = [
    {
        id: 1,
        author: 'João da Silva',
        authorPicture: defaultPictureUrl,
        createdAt: '28/07/2026 21:15',
        message:
            'Encontrei esse grupo de javalis atravessando a estrada durante a manhã. Achei importante registrar porque estavam muito próximos da pista.',
        mine: false
    },
    {
        id: 2,
        author: 'Maria Oliveira',
        authorPicture: defaultPictureUrl,
        createdAt: '28/07/2026 21:18',
        message:
            'Também vi alguns deles ontem. Aparentemente estão utilizando aquela área como rota.',
        mine: false
    },
    {
        id: 3,
        author: 'Você',
        authorPicture: defaultPictureUrl,
        createdAt: '28/07/2026 21:22',
        message:
            'Obrigado pelo registro! Vou acompanhar para verificar se aparecem novos relatos na região.',
        mine: true
    },
    {
        id: 4,
        author: 'Carlos Souza',
        authorPicture: defaultPictureUrl,
        createdAt: '28/07/2026 21:29',
        message: 'Talvez seja interessante sinalizar esse trecho para evitar acidentes.',
        mine: false
    }
];

export default function Thread() {
    const { id } = useParams();

    const parsedId = Number(id);

    const { getThread } = useThreads();

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
                const response = await getThread(parsedId);
                if (!mounted) return;
                setThread(response);
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
    }, [getThread, parsedId]);

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

                            <span className={styles.chatMeta}>
                                {MOCK_MESSAGES.length} mensagens
                            </span>
                        </header>

                        <ThreadMessageList messages={MOCK_MESSAGES} />
                        <ThreadMessageInput />
                    </section>
                </div>
            </main>
        </div>
    );
}
