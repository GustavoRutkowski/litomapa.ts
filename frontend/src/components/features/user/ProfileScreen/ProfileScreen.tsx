import { ChangeEvent, useId } from 'react';
import useProfile from '../../../../hooks/useProfile';
import PhotoField from '../PhotoField/PhotoField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

export default function ProfileScreen() {
    const usernameInputId = useId();
    const { currUsername, setUsername, setScreen } = useProfile();

    const gotoPassword = () => setScreen('password');
    const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);

    return (
        <>
            <header>
                <h3>Editar perfil</h3>
                <button onClick={gotoPassword}>Trocar senha</button>
            </header>

            <form>
                <PhotoField />

                <fieldset>
                    <label htmlFor={usernameInputId}>Nome</label>
                    <input
                        id={usernameInputId}
                        type="text"
                        placeholder="Digite o seu username"
                        value={currUsername}
                        onChange={onChangeUsername}
                    />
                </fieldset>
            </form>

            <button>
                <FontAwesomeIcon icon={faFloppyDisk} />
                <span>Salvar alterações</span>
            </button>
        </>
    );
}
