import { useCallback, useEffect, useRef, useState } from 'react';

import Header from '../../components/common/Header/Header';
import SearchBar from '../../components/ui/SearchBar/SearchBar';
import ThreadCard from '../../components/features/forum/ThreadCard/ThreadCard';

import styles from './Forum.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import useThreads from '../../hooks/useThreads';
import { ThreadDTO } from '../../services/threads.service';

type ForumFilter = 'all' | 'migration' | 'invasive' | 'report';

interface IFilter {
    value: ForumFilter;
    label: string;
    className: string;
}

const FILTERS: IFilter[] = [
    { value: 'all', label: 'Todos', className: styles.filterButtonAll },
    { value: 'migration', label: 'Migrações', className: styles.filterButtonMigrations },
    { value: 'invasive', label: 'Espécies Invasoras', className: styles.filterButtonInvasives },
    { value: 'report', label: 'Crimes Ambientais', className: styles.filterButtonCrimes }
];

interface IFilterButtonProps {
    filter: IFilter;
    active: boolean;
    onClick: () => void;
}

function FilterButton({ filter, active, onClick }: IFilterButtonProps) {
    const className = [
        styles.filterButton,
        filter.className,
        active ? styles.filterButtonActive : ''
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button type="button" className={className} aria-pressed={active} onClick={onClick}>
            {filter.label}
        </button>
    );
}

export default function Forum() {
    const PAGE_SIZE = 10;

    const [threads, setThreads] = useState<ThreadDTO[]>([]);
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(false);

    const [selectedFilter, setSelectedFilter] = useState<ForumFilter>('all');
    const [search, setSearch] = useState('');

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

                <div className={styles.filters}>
                    {FILTERS.map(filter => (
                        <FilterButton
                            key={filter.value}
                            filter={filter}
                            active={selectedFilter === filter.value}
                            onClick={() => setSelectedFilter(filter.value)}
                        />
                    ))}
                </div>

                <section className={styles.threads}>
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
            >
                <FontAwesomeIcon icon={faPlus} />
                <span>Nova discussão</span>
            </button>
        </div>
    );
}
