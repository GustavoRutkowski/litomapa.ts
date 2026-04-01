import styles from './LogoBanner.module.scss'
import logoUrl from '@/assets/logo.png'

export default function LogoBanner() {
    return (
        <header className={styles.container}>
            <img src={logoUrl} alt="LitoMapa logo" />
            <h1>LitoMapa</h1>
        </header>
    );
}
