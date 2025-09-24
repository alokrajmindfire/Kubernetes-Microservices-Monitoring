import swaggerJSDoc from 'swagger-jsdoc'
import { SwaggerUiOptions } from 'swagger-ui-express'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Service (A)',
      version: '1.0.0',
      description: 'API documentation Service (A)',
    },
    // tags: [
    //   { name: 'Auth', description: 'Authentication endpoints' },
    //   { name: 'Assets', description: 'Asset management endpoints' },
    //   { name: 'Teams', description: 'Team management endpoints' },
    //   { name: 'Projects', description: 'Project management endpoints' },
    //   { name: 'Dashboard', description: 'Dashboard endpoints' },
    // ],
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/docs/*.ts'],
}

export const swaggerSpec = swaggerJSDoc(options)

export const swaggerUiOptions: SwaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
}
