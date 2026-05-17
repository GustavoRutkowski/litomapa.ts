import swaggerJsDoc from 'swagger-jsdoc';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
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
} from './schemas/user.schemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generator = new OpenApiGeneratorV3([
    CreateUserSchema,
    LoginSchema,
    UpdateUserInfosSchema,
    UpdateUserPasswordSchema,
    UserResponseSchema,
    CreateUserResponseSchema,
    LoginResponseSchema,
    UpdateUserInfosResponseSchema,
    UpdateUserPasswordResponseSchema
]);

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

        tags: [{ name: 'Users', description: 'Operações com Usuários' }],

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
