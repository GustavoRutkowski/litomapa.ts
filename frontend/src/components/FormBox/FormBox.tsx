import React from 'react';
import Box from '../Box/Box';
import styles from './FormBox.module.scss';

interface IProps {
    title?: string;
    onSubmit?: React.SubmitEventHandler<HTMLFormElement>
    children: React.ReactNode;
}

export default function FormBox({ title = undefined, onSubmit = undefined, children }: IProps) {
    return (
        <Box title={title}>
            <form className={styles.form} onSubmit={onSubmit}>
                {children}
            </form>
        </Box>
    );
}
