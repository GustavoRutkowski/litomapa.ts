import { useState } from 'react';

import Header from '../../components/common/Header/Header';
import SearchBar from '../../components/ui/SearchBar/SearchBar';
import ThreadCard from '../../components/features/forum/ThreadCard/ThreadCard';

import defaultPictureUrl from '@/assets/default-picture.png';

import styles from './Forum.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

type ForumFilter = 'all' | 'migration' | 'invasive' | 'crime';

interface IFilter {
    value: ForumFilter;
    label: string;
    className: string;
}

const FILTERS: IFilter[] = [
    { value: 'all', label: 'Todos', className: styles.filterButtonAll },
    { value: 'migration', label: 'Migrações', className: styles.filterButtonMigrations },
    { value: 'invasive', label: 'Espécies Invasoras', className: styles.filterButtonInvasives },
    { value: 'crime', label: 'Crimes Ambientais', className: styles.filterButtonCrimes }
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
    const [selectedFilter, setSelectedFilter] = useState<ForumFilter>('all');
    const [search, setSearch] = useState('');

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
                    <ThreadCard
                        author="João da Silva"
                        authorPicture={defaultPictureUrl}
                        title="Avistamento de javalis próximo à BR-386"
                        description="Durante uma caminhada encontrei um grupo de javalis próximo à rodovia. Eles aparentavam estar procurando alimento próximos à vegetação e representavam risco aos veículos."
                        createdAt="há 3 dias"
                        location="BR-386 • Soledade - RS"
                        upvotes={23}
                        tags={[
                            {
                                label: 'Migração',
                                color: '#9e2f79'
                            },
                            {
                                label: 'Mamíferos',
                                color: '#4b78f0'
                            },
                            {
                                label: 'Javali',
                                color: '#6b7280'
                            }
                        ]}
                    />

                    <ThreadCard
                        author="Maria Oliveira"
                        authorPicture={defaultPictureUrl}
                        title="Grande concentração de capivaras em área urbana"
                        description="Nos últimos dias percebi diversas capivaras próximas ao parque municipal. A quantidade aumentou bastante em comparação aos meses anteriores."
                        createdAt="há 1 semana"
                        location="Parque Municipal • Passo Fundo - RS"
                        upvotes={58}
                        tags={[
                            {
                                label: 'Mamíferos',
                                color: '#4b78f0'
                            },
                            {
                                label: 'Capivara',
                                color: '#6b7280'
                            },
                            {
                                label: 'Área Urbana',
                                color: '#0f766e'
                            }
                        ]}
                    />

                    <ThreadCard
                        author="Carlos Souza"
                        authorPicture={defaultPictureUrl}
                        title="Possível descarte irregular próximo ao rio"
                        description="Observei diversos resíduos descartados às margens do rio. O material parece ser proveniente de construção civil e pode representar risco ao ecossistema local."
                        createdAt="há 2 semanas"
                        location="Rio Taquari • Lajeado - RS"
                        upvotes={12}
                        tags={[
                            {
                                label: 'Crime Ambiental',
                                color: '#d9480f'
                            },
                            {
                                label: 'Poluição',
                                color: '#dc2626'
                            },
                            {
                                label: 'Rio',
                                color: '#2563eb'
                            }
                        ]}
                    />
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
