import { useState } from 'react';
import Header from '../../components/common/Header/Header';
import MapView from '../../components/features/map/MapView/MapView';
import styles from './Dashboard.module.scss';
import { GeoJsonObject } from 'geojson';

import rsMap from '../../assets/map-geojson.json';

type DashboardFilter = 'all' | 'migration' | 'invasive' | 'crime';

interface ITagItem {
    value: DashboardFilter;
    label: string;
    className: string;
}

const FILTERS: ITagItem[] = [
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

interface IFilterButtonProps {
    filter: ITagItem;
    active: boolean;
    onClick: () => void;
}

function FilterButton({ filter, active, onClick }: IFilterButtonProps) {
    const buttonClassName = [
        styles.filterButton,
        filter.className,
        active ? styles.filterButtonActive : ''
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            key={filter.value}
            type="button"
            className={buttonClassName}
            aria-pressed={active}
            onClick={onClick}
        >
            {filter.label}
        </button>
    );
}

export default function Dashboard() {
    const [selectedFilter, setSelectedFilter] = useState<DashboardFilter>('all');

    return (
        <div className={styles.container}>
            <Header />

            <main>
                <div className={styles.filters}>
                    {FILTERS.map(filter => {
                        const isActive = selectedFilter === filter.value;

                        return (
                            <FilterButton
                                filter={filter}
                                active={isActive}
                                onClick={() => setSelectedFilter(filter.value)}
                            />
                        );
                    })}
                </div>

                <MapView geojson={rsMap as GeoJsonObject} tag={FILTER_TAGS[selectedFilter]} />
            </main>
        </div>
    );
}
