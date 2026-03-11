import { Router } from 'express';
import UsersController from '../controllers/UsersController';

const usersRouter = Router();

usersRouter.post('/', UsersController.createUser);
usersRouter.post('login', UsersController.login);
usersRouter.get('/', UsersController.getUser);

usersRouter.patch('/username', UsersController.changeUsername);
usersRouter.patch('/password', UsersController.changePassword);
usersRouter.patch('/photo', UsersController.changePhoto);

usersRouter.delete('/photo', UsersController.removePhoto);
usersRouter.delete('/', UsersController.deleteUser);

export default usersRouter;
