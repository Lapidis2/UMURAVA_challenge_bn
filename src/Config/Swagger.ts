import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Challenge API',
    version: '1.0.0',
    description: 'API documentation for the Challenge Backend',
  },
  servers: [
    {
      url: 'http://localhost:3000', 
      description: 'Development Server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/Routers/*.ts'], 
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
