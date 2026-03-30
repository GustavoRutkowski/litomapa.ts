import Header from '../../components/Header/Header';
import styles from './Dashboard.module.scss';

export default function Dashboard() {
    return (
        <div className={styles.container}>
            <Header />
            <main>
                <p>Está é a página de dashboard!</p>
            </main>
        </div>
    );
}
