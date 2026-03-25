import RegisterForm from '../../components/RegisterForm/RegisterForm';
import LogoBanner from '../../components/LogoBanner/LogoBanner';
import styles from './Register.module.scss';

export default function Register() {
    return (
        <div className={styles.container}>
            <LogoBanner />
            <RegisterForm />
        </div>
    );
}
