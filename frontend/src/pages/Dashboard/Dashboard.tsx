import { useState } from 'react';
import Header from '../../components/common/Header/Header';
import MapView from '../../components/features/map/MapView/MapView';
import styles from './Dashboard.module.scss';

import rsMap from '../../assets/rs-map.json';

type DashboardFilter = 'all' | 'migration' | 'invasive' | 'crime';

const FILTERS: Array<{ value: DashboardFilter; label: string; className: string }> = [
    { value: 'all', label: 'Todos', className: styles.filterButtonAll },
    { value: 'migration', label: 'Migrações', className: styles.filterButtonMigrations },
    { value: 'invasive', label: 'Espécies Invasoras', className: styles.filterButtonInvasives },
    { value: 'crime', label: 'Crimes Ambientais', className: styles.filterButtonCrimes }
];

const FILTER_TAGS: Record<DashboardFilter, string | undefined> = {
    all: undefined,
    migration: 'MIGRATION',
    invasive: 'INVASIVE_SPECIES',
    crime: 'REPORT'
};

export default function Dashboard() {
    const [selectedFilter, setSelectedFilter] = useState<DashboardFilter>('all');

    return (
        <div className={styles.container}>
            <Header />
            <main>
                <div className={styles.filters}>
                    {FILTERS.map(filter => {
                        const isActive = selectedFilter === filter.value;
                        const buttonClassName = [
                            styles.filterButton,
                            filter.className,
                            isActive ? styles.filterButtonActive : ''
                        ]
                            .filter(Boolean)
                            .join(' ');

                        return (
                            <button
                                key={filter.value}
                                type="button"
                                className={buttonClassName}
                                aria-pressed={isActive}
                                onClick={() => setSelectedFilter(filter.value)}
                            >
                                {filter.label}
                            </button>
                        );
                    })}
                </div>
                <MapView height={450} geojson={rsMap} tag={FILTER_TAGS[selectedFilter]} />
            </main>
        </div>
    );
}
