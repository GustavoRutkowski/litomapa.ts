import styles from './Box.module.scss';

interface IProps {
    title?: string;
    children: React.ReactNode;
}

export default function Box({ title = undefined, children }: IProps) {
    return (
        <section className={styles.container}>
            { title && <h2>{ title }</h2> }
            { children }
        </section>
    );
}
