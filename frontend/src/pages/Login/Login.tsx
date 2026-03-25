import LoginForm from '../../components/LoginForm/LoginForm';
import LogoBanner from '../../components/LogoBanner/LogoBanner';
import styles from './Login.module.scss';

export default function Login() {
    return (
        <div className={styles.container}>
            <LogoBanner />
            <LoginForm />
        </div>
    );
}
