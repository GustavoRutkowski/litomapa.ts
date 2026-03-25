import styles from './LogoBanner.module.scss'

export default function LogoBanner() {
    return (
        <header className={styles.container}>
            <img src="./src/assets/logo.png" alt="" />
            <h1>LitoMapa</h1>
        </header>
    );
}
