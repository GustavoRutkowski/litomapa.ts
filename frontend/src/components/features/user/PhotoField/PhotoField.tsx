import { ChangeEvent, useRef } from 'react';
import useProfile from '../../../../hooks/useProfile';
import defaultPictureUrl from '../../../../assets/default-picture.png';
import styles from './PhotoField.module.scss';

export default function PhotoField() {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { currPhoto, setPhoto } = useProfile();

    const handlePick = () => inputRef.current?.click();
    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileReader = new FileReader();
        fileReader.onload = () => {
            const result = fileReader.result;
            if (typeof result === 'string') {
                setPhoto(result);
            }
        };

        fileReader.readAsDataURL(file);
    };

    const formatPhoto = (photo: string | null | undefined) => {
        if (!photo) return null;
        return `/api/uploads/${photo}`;
    };

    return (
        <fieldset className={styles.container}>
            <img src={formatPhoto(currPhoto) || defaultPictureUrl} alt="" />

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
