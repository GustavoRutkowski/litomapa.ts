import { Link } from 'react-router-dom';
import styles from './Home.module.scss';

export default function Home() {
    return (
        <div className={styles.container}>
            <p>Está é a página principal! <b>(em desenvolvimento)</b></p><br />
            <p>Vá para a página de <Link to="/login">login</Link> ou para a página de <Link to="/register">registro</Link>.</p>
        </div>
    );
}
