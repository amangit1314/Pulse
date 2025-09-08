import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event Management API',
      version: '1.0.0',
      description: 'A comprehensive API for managing events and attendee registrations',
      contact: {
        name: 'API Support',
        email: 'your.email@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Event: {
          type: 'object',
          required: ['name', 'location', 'start_time', 'end_time', 'max_capacity'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique event identifier'
            },
            name: {
              type: 'string',
              description: 'Event name',
              example: 'Tech Conference 2025'
            },
            location: {
              type: 'string',
              description: 'Event location',
              example: 'Jaipur Convention Center'
            },
            start_time: {
              type: 'string',
              format: 'date-time',
              description: 'Event start time in ISO format'
            },
            end_time: {
              type: 'string',
              format: 'date-time',
              description: 'Event end time in ISO format'
            },
            max_capacity: {
              type: 'integer',
              minimum: 1,
              description: 'Maximum number of attendees',
              example: 100
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'When the event was created'
            }
          }
        },
        CreateEvent: {
          type: 'object',
          required: ['name', 'location', 'start_time', 'end_time', 'max_capacity'],
          properties: {
            name: {
              type: 'string',
              minLength: 1,
              example: 'Tech Conference 2025'
            },
            location: {
              type: 'string',
              minLength: 1,
              example: 'Jaipur Convention Center'
            },
            start_time: {
              type: 'string',
              format: 'date-time',
              example: '2025-03-15T09:00:00+05:30'
            },
            end_time: {
              type: 'string',
              format: 'date-time',
              example: '2025-03-15T17:00:00+05:30'
            },
            max_capacity: {
              type: 'integer',
              minimum: 1,
              example: 100
            }
          }
        },
        Registration: {
          type: 'object',
          properties: {
            id: {
              type: 'string'
            },
            event_id: {
              type: 'string'
            },
            name: {
              type: 'string',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        RegisterAttendee: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: {
              type: 'string',
              minLength: 1,
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            },
            data: {
              type: 'object'
            }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            data: {
              type: 'array',
              items: {}
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            code: {
              type: 'string',
              example: 'EVENT_001'
            }
          }
        }
      },
      parameters: {
        EventId: {
          name: 'event_id',
          in: 'path',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'Event ID'
        },
        Page: {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1
          },
          description: 'Page number'
        },
        Limit: {
          name: 'limit',
          in: 'query',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10
          },
          description: 'Items per page'
        },
        Timezone: {
          name: 'timezone',
          in: 'query',
          schema: {
            type: 'string',
            default: 'Asia/Kolkata'
          },
          description: 'Timezone for date conversion'
        }
      }
    }
  },
  apis: ['./src/features/**/*.routes.ts'] // Path to route files
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Event Management API Documentation'
  }));
  
  // JSON endpoint for the spec
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};