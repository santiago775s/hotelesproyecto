import express from 'express'
import { initializeController } from './infraestructura/controllers'
import methodOverride from 'method-override'
import { MemoryHotelRepositoryImpl } from './infraestructura/persistance/hotel.repository.impl';
import { IHotelRepository } from './aplicacion/ports/IHotelRepository';
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './infraestructura/swagger/swagger.config'
import cors from 'cors';
import { PgHotelRepositoryImpl } from './infraestructura/persistance/hotel.repository.pg.impl';

const memoriHotelRepository = new MemoryHotelRepositoryImpl();
const pgHotelRepository = new PgHotelRepositoryImpl({
  user: 'alumno',
  password: '123456',
  host: '127.0.0.1',
  port: 5432,
  database: 'db-hoteles'
});
// PosgresDbHotelRepositoryImpl

export function createApp(repository: IHotelRepository) {
  const app = express()

  app.use(cors({
    origin: '*', // Dominio autorizado
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
    optionsSuccessStatus: 200 // Compatibilidad con navegadores antiguos
  }))

  // Captura de la excepcion



  app.use(express.json()) // for parsing application/json
  app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
  app.use(methodOverride())

  /*
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('En error <---------------------');
    const respError = ExceptionHandler.handle(err as Error);
    return res.status(respError.status).json({
          message: respError.message,
          error: respError.error,
        });
  });
  */

  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { 
    swaggerOptions: {
      persistAuthorization: true,
    }
  }))

  // Descargar especificación OpenAPI en JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', 'attachment; filename="api-docs.json"')
    res.send(swaggerSpec)
  })

  // capturar excepciones

  app.get('/', (req, res) => {
    res.send('Hello World')
  })

  app.post('/test-form', (req, res) => {
    console.log('body del request:', req.body)
    res.send('Hello World')
  })

  initializeController(app, repository);

  // GET - optener datos
  // POST - mandar datos

  // PUT - crea o actualiza
  // PATCH - actualiza

  // DELETE - eliminar

  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
    console.log('Swagger API Documentation available at http://localhost:3000/api-docs')
    console.log('Download API spec JSON at http://localhost:3000/api-docs.json')
  })

  return app;
}

createApp(pgHotelRepository)
