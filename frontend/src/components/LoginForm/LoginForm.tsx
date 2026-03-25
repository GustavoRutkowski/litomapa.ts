import { useId } from 'react';
import FormBox from '../FormBox/FormBox';
import { Link } from 'react-router-dom';

export default function LoginForm() {
    const emailInputId = useId();
    const passwordInputId = useId();
    
    return (
        <FormBox title='Login'>
            <fieldset>
                <label htmlFor={emailInputId}>E-mail:</label>
                <input id={emailInputId} type="email" placeholder="example@foo.bar" required />
            </fieldset>

            <fieldset>
                <label htmlFor={passwordInputId}>Password:</label>
                <input id={passwordInputId} type="password" required />
            </fieldset>

            <button type="submit">Sign-in</button>
            <p>Don't have an account? <Link to="/register">Sign up</Link>.</p>
        </FormBox>
    );
}
