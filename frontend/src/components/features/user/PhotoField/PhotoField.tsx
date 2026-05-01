import { ChangeEvent, useRef } from 'react';
import useProfile from '../../../../hooks/useProfile';
import defaultPictureUrl from '../../../../assets/default-picture.png';
import styles from './PhotoField.module.scss';

export default function PhotoField() {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { currPhoto, setPhoto } = useProfile();

    const handlePick = () => inputRef.current?.click();
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPhoto(url);
    };

    return (
        <fieldset className={styles.container}>
            <img src={currPhoto || defaultPictureUrl} alt="" />

            <div className={styles.info}>
                <strong>Foto do perfil</strong>
                <p>Escolha uma imagem quadrada para um resultado mais consistente.</p>
            </div>

            <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} hidden />
            <button type="button" onClick={handlePick}>
                Alterar foto
            </button>
        </fieldset>
    );
}
