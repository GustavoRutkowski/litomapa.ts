import { useId } from 'react';
import FormBox from '../FormBox/FormBox';
import { Link } from 'react-router-dom';

export default function RegisterForm() {
    const usernameInputId = useId();
    const emailInputId = useId();
    const passwordInputId = useId();
    
    return (
        <FormBox title='Register'>
            <fieldset>
                <label htmlFor={usernameInputId}>Username:</label>
                <input id={usernameInputId} type="text" required maxLength={25} />
            </fieldset>
            
            <fieldset>
                <label htmlFor={emailInputId}>E-mail:</label>
                <input id={emailInputId} type="email" placeholder="example@foo.bar" required />
            </fieldset>

            <fieldset>
                <label htmlFor={passwordInputId}>Password:</label>
                <input id={passwordInputId} type="password" required />
            </fieldset>

            <button type="submit">Sign-up</button>
            <p>Already have an account? <Link to="/login">Log in</Link>.</p>
        </FormBox>
    );
}
