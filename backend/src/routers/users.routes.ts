import { Router } from 'express';
import UC from '../controllers/users.controller.js';
import isLogged from '../middlewares/auth/isLogged.js';
import validateUser, { validateEmail, validatePassword, validatePhoto, validateUsername } from '../middlewares/validation/users.middlewares.js';

const usersRouter = Router();

usersRouter.post('/', validateUser, UC.createUser);
usersRouter.post('/login', [validateEmail, validatePassword], UC.login);

usersRouter.get('/', isLogged, UC.getUser);

usersRouter.patch('/username', isLogged, validateUsername, UC.changeUsername);
usersRouter.patch('/password', isLogged, validatePassword, UC.changePassword);
usersRouter.patch('/photo', isLogged, validatePhoto, UC.changePhoto);

usersRouter.delete('/photo', isLogged, UC.removePhoto);
usersRouter.delete('/', isLogged, UC.deleteUser);

export default usersRouter;
