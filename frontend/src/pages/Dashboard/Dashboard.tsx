import { useState } from 'react';
import {
    faGlobe,
    faLeaf,
    faMapLocationDot,
    faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';

import Header from '../../components/common/Header/Header';
import MapView from '../../components/features/map/MapView/MapView';
import { FilterButtonList } from '../../components/ui/FilterButton/FilterButton';
import styles from './Dashboard.module.scss';
import { GeoJsonObject } from 'geojson';

import rsMap from '../../assets/map-geojson.json';

type DashboardFilter = 'all' | 'migration' | 'invasive' | 'crime';

const FILTER_OPTIONS = [
    { value: 'all', label: 'Todos', icon: faGlobe },
    { value: 'migration', label: 'Migrações', icon: faMapLocationDot },
    { value: 'invasive', label: 'Espécies Invasoras', icon: faLeaf },
    { value: 'crime', label: 'Crimes Ambientais', icon: faTriangleExclamation }
] as const;

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
                <FilterButtonList
                    options={FILTER_OPTIONS}
                    value={selectedFilter}
                    onChange={setSelectedFilter}
                    className={styles.filters}
                />

                <MapView geojson={rsMap as GeoJsonObject} tag={FILTER_TAGS[selectedFilter]} />
            </main>
        </div>
    );
}
