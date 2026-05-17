import { Router } from 'express';
import UserController from '../controllers/users.controller.js';
import isLogged from '../middlewares/isLogged.js';

const usersRouter = Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserResponse'
 *       400:
 *         description: Generic example of a possible error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseSchema'
 */
usersRouter.post('/', UserController.create);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in
 *     description: Authenticates the user and returns a JWT token
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Generic example of a possible error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseSchema'
 */
usersRouter.post('/login', UserController.login);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get data from authenticated user
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Generic example of a possible error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseSchema'
 */
usersRouter.get('/', isLogged, UserController.get);

/**
 * @swagger
 * /users
 *   patch
 *     summary: Change user infos
 *     description: Change the user's name and photo
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInfos'
 *     responses:
 *       200:
 *         description: User infos updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserInfosResponse'
 *       400:
 *         description: Generic example of a possible error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseSchema'
 */
usersRouter.patch('/', isLogged, UserController.changeInfos);

/**
 * @swagger
 * /users
 *   patch
 *     summary: Change user password
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserPassword'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserPasswordResponse'
 *       400:
 *         description: Generic example of a possible error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseSchema'
 */
usersRouter.patch('/password', isLogged, UserController.changePassword);

export default usersRouter;
