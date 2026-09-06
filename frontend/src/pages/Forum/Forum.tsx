import { useCallback, useEffect, useRef, useState } from 'react';
import {
    faGlobe,
    faLeaf,
    faMapLocationDot,
    faPlus,
    faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Header from '../../components/common/Header/Header';
import ThreadCard from '../../components/features/forum/ThreadCard/ThreadCard';
import NewThreadModal from '../../components/features/thread/NewThreadModal/NewThreadModal';
import { FilterButtonList } from '../../components/ui/FilterButton/FilterButton';
import SearchBar from '../../components/ui/SearchBar/SearchBar';
import useThreads from '../../hooks/useThreads';
import { ThreadDTO } from '../../services/threads.service';

import styles from './Forum.module.scss';

type ForumFilter = 'all' | 'migration' | 'invasive' | 'report';

const FILTER_OPTIONS = [
    { value: 'all', label: 'Todos', icon: faGlobe },
    { value: 'migration', label: 'Migrações', icon: faMapLocationDot },
    { value: 'invasive', label: 'Espécies Invasoras', icon: faLeaf },
    { value: 'report', label: 'Crimes Ambientais', icon: faTriangleExclamation }
] as const;

export default function Forum() {
    const PAGE_SIZE = 10;

    const [threads, setThreads] = useState<ThreadDTO[]>([]);
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    const [selectedFilter, setSelectedFilter] = useState<ForumFilter>('all');
    const [search, setSearch] = useState('');
    const [isNewThreadModalOpen, setIsNewThreadModalOpen] = useState(false);

    const { getThreads } = useThreads();
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const loadThreads = useCallback(
        async (reset = false) => {
            if (loading) return;

            setLoading(true);

            const currentOffset = reset ? 0 : offset;

            const response = await getThreads({
                limit: PAGE_SIZE,
                offset: currentOffset,
                title: search || undefined,
                tag: selectedFilter === 'all' ? undefined : selectedFilter
            });

            setTotal(response.total);
            setHasLoaded(true);

            if (reset) {
                setThreads(response.data);
                setOffset(response.data.length);
            } else {
                setThreads(previous => [...previous, ...response.data]);
                setOffset(previous => previous + response.data.length);
            }

            setLoading(false);
        },
        [loading, offset, search, selectedFilter, getThreads]
    );

    useEffect(() => {
        void loadThreads(true);
    }, [search, selectedFilter]);

    useEffect(() => {
        const element = loadMoreRef.current;

        if (!element) return;

        const observer = new IntersectionObserver(
            entries => {
                const entry = entries[0];

                if (!entry.isIntersecting) return;

                if (loading) return;

                if (threads.length >= total) return;

                void loadThreads();
            },
            {
                threshold: 0.2
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [threads.length, total, loading, loadThreads]);

    return (
        <div className={styles.container}>
            <Header />

            <main>
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Pesquisar discussões..."
                />

                <FilterButtonList
                    options={FILTER_OPTIONS}
                    value={selectedFilter}
                    onChange={setSelectedFilter}
                    className={styles.filters}
                />

                <section className={styles.threads}>
                    {!loading && hasLoaded && threads.length === 0 && (
                        <p className={styles.empty}>Nenhuma discussão encontrada</p>
                    )}
                    {threads.map(thread => (
                        <ThreadCard thread={thread} />
                    ))}
                    <div ref={loadMoreRef} />
                </section>
            </main>

            <button
                type="button"
                className={styles.newThreadButton}
                aria-label="Criar nova discussão"
                title="Criar uma nova discussão"
                onClick={() => setIsNewThreadModalOpen(true)}
            >
                <FontAwesomeIcon icon={faPlus} />
                <span>Nova discussão</span>
            </button>

            <NewThreadModal
                open={isNewThreadModalOpen}
                onClose={() => setIsNewThreadModalOpen(false)}
            />
        </div>
    );
}
