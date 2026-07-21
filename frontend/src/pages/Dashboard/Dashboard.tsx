import Header from '../../components/common/Header/Header';
import MapView from '../../components/features/map/MapView/MapView';
import styles from './Dashboard.module.scss';

import rsMap from '../../assets/rs-map.json';

export default function Dashboard() {
    return (
        <div className={styles.container}>
            <Header />
            <main>
                <MapView height={500} geojson={rsMap} />
            </main>
        </div>
    );
}
