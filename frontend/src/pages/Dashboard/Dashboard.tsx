import Header from '../../components/common/Header/Header';
import MapView from '../../components/features/map/MapView/MapView';
import styles from './Dashboard.module.scss';

import rsMap from '../../assets/rs-map.json';

export default function Dashboard() {
    return (
        <div className={styles.container}>
            <Header />
            <main>
                <div className={styles.filters}>
                    <button className={`${styles.filterButton} ${styles.filterButtonAll}`}>
                        Todos
                    </button>
                    <button className={`${styles.filterButton} ${styles.filterButtonMigrations}`}>
                        Migrações
                    </button>
                    <button className={`${styles.filterButton} ${styles.filterButtonInvasives}`}>
                        Espécies Invasoras
                    </button>
                    <button className={`${styles.filterButton} ${styles.filterButtonCrimes}`}>
                        Crimes Ambientais
                    </button>
                </div>
                <MapView height={450} geojson={rsMap} />
            </main>
        </div>
    );
}
