import swaggerJsDoc from 'swagger-jsdoc';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { ErrorResponseSchema } from './schemas/global.schemas.js';
import {
    CreateUserSchema,
    LoginSchema,
    UpdateUserInfosSchema,
    UpdateUserPasswordSchema,
    UserResponseSchema,
    CreateUserResponseSchema,
    LoginResponseSchema,
    UpdateUserInfosResponseSchema,
    UpdateUserPasswordResponseSchema
} from './schemas/users.schemas.js';
import {
    ThreadSchema,
    ThreadResponseSchema,
    ThreadsQuerySchema,
    ThreadsResponseSchema
} from './schemas/threads.schemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const registry = new OpenAPIRegistry();

registry.register('CreateUser', CreateUserSchema);
registry.register('Login', LoginSchema);
registry.register('UpdateUserInfos', UpdateUserInfosSchema);
registry.register('UpdateUserPassword', UpdateUserPasswordSchema);
registry.register('UserResponse', UserResponseSchema);
registry.register('CreateUserResponse', CreateUserResponseSchema);
registry.register('LoginResponse', LoginResponseSchema);
registry.register('UpdateUserInfosResponse', UpdateUserInfosResponseSchema);
registry.register('UpdateUserPasswordResponse', UpdateUserPasswordResponseSchema);
registry.register('Thread', ThreadSchema);
registry.register('ThreadResponse', ThreadResponseSchema);
registry.register('ThreadsQuery', ThreadsQuerySchema);
registry.register('ThreadsResponse', ThreadsResponseSchema);
registry.register('ErrorResponse', ErrorResponseSchema);

const generator = new OpenApiGeneratorV3(registry.definitions);

const zodComponents = generator.generateComponents();

const options: swaggerJsDoc.Options = {
    definition: {
        openapi: '3.0.0',

        info: {
            title: 'Litomapa - API',
            description: 'Documentação para as rotas da API do projeto.',
            version: '1.0.0'
        },

        servers: [{ url: '/' }],

        tags: [
            { name: 'Users', description: 'Operações com Usuários' },
            { name: 'Threads', description: 'Operações com Threads' }
        ],

        components: {
            schemas: { ...zodComponents.components?.schemas },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT obtido no login'
                }
            }
        }
    },
    apis: [join(__dirname, './routers/*.js')]
};

export const swaggerSpec = swaggerJsDoc(options);
