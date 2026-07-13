// FILE: backend/config/swagger.js


import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import YAML from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Load OpenAPI specification
 * 
 *  Child Explanation:
 * "This reads our menu (openapi.yaml) and prepares it to be shown
 * beautifully in the Swagger UI."
 * 
 *  Technical Explanation:
 * "We load the OpenAPI YAML file and parse it to provide to Swagger UI.
 * This allows us to serve interactive API documentation."
 */
const loadOpenAPISpec = () => {
  try {
    const yamlPath = join(__dirname, '../openapi.yaml');
    const yamlContent = readFileSync(yamlPath, 'utf8');
    return YAML.parse(yamlContent);
  } catch (error) {
    console.error(' Failed to load OpenAPI spec:', error.message);
    return null;
  }
};

/**
 * Set up Swagger UI
 * 
 *  Child Explanation:
 * "This creates the beautiful menu page where people can see all the ways
 * to talk to our kitchen."
 * 
 *  Technical Explanation:
 * "We configure Swagger UI to serve the OpenAPI documentation with a custom
 * title and options."
 */
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'LoanFlow API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true,
  },
};

/**
 * Get Swagger UI middleware
 * 
 *  Child Explanation:
 * "This prepares the complete package to show our API menu."
 * 
 *  Technical Explanation:
 * "We create the complete Swagger UI setup with our specification and options."
 */
const getSwaggerUI = () => {
  const spec = loadOpenAPISpec();
  if (!spec) {
    return null;
  }
  
  // Return the middleware
  return swaggerUi.setup(spec, swaggerOptions);
};

export default getSwaggerUI;