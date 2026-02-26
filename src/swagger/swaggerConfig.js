import swaggerJsdoc from 'swagger-jsdoc';

/**
 * Swagger/OpenAPI configuration
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ComuniApp API',
      description: 'REST API for ComuniApp - Community Communication Platform',
      version: '1.0.0',
      contact: {
        name: 'API Support',
        email: 'support@comuniapp.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server',
      },
      {
        url: 'https://api.comuniapp.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using Bearer scheme',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            nombre: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            telefono: {
              type: 'string',
              example: '+34 123 456 789',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Post: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            titulo: {
              type: 'string',
              example: 'Community Event',
            },
            descripcion: {
              type: 'string',
              example: 'Details about the community event',
            },
            categoria_id: {
              type: 'integer',
              example: 1,
            },
            ubicacion_id: {
              type: 'integer',
              example: 1,
            },
            usuario_id: {
              type: 'integer',
              example: 1,
            },
            likes: {
              type: 'integer',
              example: 10,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            nombre: {
              type: 'string',
              example: 'Events',
            },
            descripcion: {
              type: 'string',
              example: 'Community events category',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Location: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            nombre: {
              type: 'string',
              example: 'Central Park',
            },
            latitud: {
              type: 'number',
              format: 'float',
              example: 40.7829,
            },
            longitud: {
              type: 'number',
              format: 'float',
              example: -73.9654,
            },
            direccion: {
              type: 'string',
              example: '123 Main Street',
            },
            ciudad: {
              type: 'string',
              example: 'New York',
            },
            provincia: {
              type: 'string',
              example: 'NY',
            },
            pais: {
              type: 'string',
              example: 'USA',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
            },
            refreshToken: {
              type: 'string',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/authRoutes.js',
    './src/routes/postsRoutes.js',
    './src/routes/categoriesRoutes.js',
    './src/routes/locationsRoutes.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
