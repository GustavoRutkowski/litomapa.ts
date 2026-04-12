import swaggerJsDoc from 'swagger-jsdoc';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        username: {
                            type: 'string',
                            example: 'joao_silva',
                            minLength: 3,
                            maxLength: 50
                        },
                        email: { type: 'string', format: 'email', example: 'joao@example.com' },
                        password: {
                            type: 'string',
                            format: 'password',
                            description: 'Apenas para criação e será hasheado'
                        },
                        photo: {
                            type: 'string',
                            nullable: true,
                            example: 'uploads/user_1_avatar.png',
                            description: 'Caminho do arquivo de foto'
                        }
                    }
                },
                UserResponse: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        username: { type: 'string', example: 'joao_silva' },
                        email: { type: 'string', format: 'email', example: 'joao@example.com' },
                        photo: {
                            type: 'string',
                            nullable: true,
                            example: 'uploads/user_1_avatar.png'
                        }
                    }
                },
                UserCreateRequest: {
                    type: 'object',
                    required: ['username', 'email', 'password'],
                    properties: {
                        username: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 50,
                            example: 'joao_silva'
                        },
                        email: { type: 'string', format: 'email', example: 'joao@example.com' },
                        password: {
                            type: 'string',
                            format: 'password',
                            minLength: 6,
                            example: 'SenhaForte123!'
                        }
                    }
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'joao@example.com' },
                        password: { type: 'string', format: 'password', example: 'SenhaForte123!' }
                    }
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        token: {
                            type: 'string',
                            description: 'JWT token para autenticação',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                        }
                    }
                },
                ChangeUsernameRequest: {
                    type: 'object',
                    required: ['username'],
                    properties: {
                        username: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 50,
                            example: 'novo_usuario'
                        }
                    }
                },
                ChangePasswordRequest: {
                    type: 'object',
                    required: ['password'],
                    properties: {
                        password: {
                            type: 'string',
                            format: 'password',
                            minLength: 6,
                            example: 'NovaSenha123!'
                        }
                    }
                },
                ChangePhotoRequest: {
                    type: 'object',
                    required: ['base64', 'filename'],
                    properties: {
                        base64: {
                            type: 'string',
                            description: 'Arquivo de imagem em base64',
                            example: 'data:image/png;base64,iVBORw0KGgo...'
                        },
                        filename: {
                            type: 'string',
                            example: 'avatar.png',
                            description: 'Nome do arquivo (png, jpg, jpeg, webp)'
                        }
                    }
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true }
                    }
                },
                CreatedResponse: {
                    type: 'object',
                    properties: {
                        insertId: {
                            type: 'integer',
                            example: 1,
                            description: 'ID do usuário criado'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string', example: 'Descrição do erro' },
                        status: { type: 'integer', example: 400 }
                    }
                }
            },
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
