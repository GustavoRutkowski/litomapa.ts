import { useId } from 'react';
import PasswordInput from '../../../ui/PasswordInput/PasswordInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

export default function PasswordScreen() {
    const oldInputId = useId();
    const newInputId = useId();
    const confirmInputId = useId();

    return (
        <>
            <header>
                <button>
                    <FontAwesomeIcon icon={faAngleLeft} />
                    <span>Voltar</span>
                </button>
                <h3>Trocar senha</h3>
            </header>

            <form>
                <fieldset>
                    <label htmlFor={oldInputId}>Senha antiga</label>
                    <PasswordInput id={oldInputId} />
                </fieldset>

                <fieldset>
                    <label htmlFor={newInputId}>Senha nova</label>
                    <PasswordInput id={newInputId} />
                </fieldset>

                <fieldset>
                    <label htmlFor={confirmInputId}>Confirmar nova senha</label>
                    <PasswordInput id={confirmInputId} />
                </fieldset>
            </form>

            <button>
                <FontAwesomeIcon icon={faFloppyDisk} />
                <span>Atualizar senha</span>
            </button>
        </>
    );
}
