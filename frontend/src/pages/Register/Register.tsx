import RegisterForm from '../../components/features/auth/RegisterForm/RegisterForm';
import LogoBanner from '../../components/common/LogoBanner/LogoBanner';
import styles from './Register.module.scss';

export default function Register() {
    return (
        <div className={styles.container}>
            <LogoBanner />
            <RegisterForm />
        </div>
    );
}
