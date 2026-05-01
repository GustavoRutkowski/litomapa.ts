import { useId } from 'react';
import useProfile from '../../../../hooks/useProfile';
import PhotoField from '../PhotoField/PhotoField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

export default function ProfileScreen() {
    const usernameInputId = useId();
    const { currUsername } = useProfile();

    return (
        <>
            <header>
                <h3>Editar perfil</h3>
                <button>Trocar senha</button>
            </header>

            <form>
                <PhotoField />

                <fieldset>
                    <label htmlFor={usernameInputId}>Nome</label>
                    <input
                        type="text"
                        id={usernameInputId}
                        placeholder="Digite o seu username"
                        value={currUsername}
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
