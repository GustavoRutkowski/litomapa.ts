import LoginForm from '../../components/features/auth/LoginForm/LoginForm';
import LogoBanner from '../../components/common/LogoBanner/LogoBanner';
import styles from './Login.module.scss';

export default function Login() {
    return (
        <div className={styles.container}>
            <LogoBanner />
            <LoginForm />
        </div>
    );
}
