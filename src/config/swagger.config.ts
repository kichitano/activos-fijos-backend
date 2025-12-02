import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerOptions } from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Activos Fijos',
    version: '1.0.0',
    description: 'API REST para el sistema de inventario de activos fijos',
    contact: {
      name: 'Christian Cespedes Medina',
      email: 'christian@example.com',
    },
    license: {
      name: 'ISC',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Servidor de desarrollo',
    },
    {
      url: 'https://api.activos-fijos.com/api',
      description: 'Servidor de producción',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Authorization header using the Bearer scheme. Example: "Bearer {token}"',
      },
    },
    responses: {
      UnauthorizedError: {
        description: 'Token de acceso faltante o inválido',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Unauthorized',
                },
                message: {
                  type: 'string',
                  example: 'Token inválido o expirado',
                },
              },
            },
          },
        },
      },
      ValidationError: {
        description: 'Error de validación de datos',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Validation Error',
                },
                message: {
                  type: 'string',
                  example: 'Datos de entrada inválidos',
                },
                errors: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: { type: 'string' },
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      NotFoundError: {
        description: 'Recurso no encontrado',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Not Found',
                },
                message: {
                  type: 'string',
                  example: 'Recurso no encontrado',
                },
              },
            },
          },
        },
      },
      ServerError: {
        description: 'Error interno del servidor',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Internal Server Error',
                },
                message: {
                  type: 'string',
                  example: 'Ocurrió un error inesperado',
                },
              },
            },
          },
        },
      },
    },
    schemas: {
      User: {
        type: 'object',
        required: ['id', 'dni', 'nombre', 'rol', 'username', 'activo', 'mustChangePassword', 'createdAt'],
        properties: {
          id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
          dni: { type: 'string', example: '12345678' },
          nombre: { type: 'string', example: 'Juan Pérez' },
          direccion: { type: 'string', nullable: true },
          celular: { type: 'string', nullable: true },
          correo1: { type: 'string', format: 'email', nullable: true },
          correo2: { type: 'string', format: 'email', nullable: true },
          rol: { type: 'string', enum: ['ADMINISTRADOR', 'COORDINADOR', 'REGISTRADOR'] },
          username: { type: 'string', example: 'jperez' },
          activo: { type: 'boolean', default: true },
          mustChangePassword: { type: 'boolean', default: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string', example: 'admin' },
          password: { type: 'string', format: 'password', example: '12345678' },
          keepSession: { type: 'boolean', default: false, description: 'true = 30 días, false = 7 días' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          expiresIn: { type: 'integer', example: 900, description: 'Duración en segundos (15 min)' },
          user: { $ref: '#/components/schemas/User' },
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Endpoints de autenticación y autorización',
    },
    {
      name: 'Users',
      description: 'Gestión de usuarios (solo ADMINISTRADOR)',
    },
    {
      name: 'Inventario',
      description: 'Consulta de inventario histórico (solo lectura)',
    },
    {
      name: 'InventarioNuevo',
      description: 'Registro de nuevos activos fijos',
    },
    {
      name: 'Auditoria',
      description: 'Registros de auditoría y ubicación GPS',
    },
    {
      name: 'Print',
      description: 'Generación de etiquetas (TODO)',
    },
  ],
};

const options: swaggerJsdoc.Options = {
  definition: swaggerDefinition,
  // Rutas a los archivos con anotaciones JSDoc
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/entities/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);

// Opciones de Swagger UI
export const swaggerUiOptions: SwaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Activos Fijos - Documentación',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
  },
};
