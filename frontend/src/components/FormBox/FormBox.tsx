import React from 'react';
import Box from '../Box/Box';
import styles from './FormBox.module.scss';

interface IProps {
    title?: string;
    children: React.ReactNode;
}

export default function FormBox({ title = undefined, children }: IProps) {
    return (
        <Box title={title}>
            <form className={styles.form}>
                {children}
            </form>
        </Box>
    );
}
