import 'reflect-metadata';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { AppDataSource } from './config/data-source';
import { requestLoggerMiddleware, errorHandlerMiddleware } from './middlewares';
import { Logger } from './utils/logger';
import { swaggerSpec, swaggerUiOptions } from './config/swagger.config';

// Importar rutas
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import inventarioRoutes from './routes/inventario.routes';
import inventarioNuevoRoutes from './routes/inventario-nuevo.routes';
import auditoriaRoutes from './routes/auditoria.routes';
import printRoutes from './routes/print.routes';
import proyectoRoutes from './routes/proyecto.routes';
import sucursalRoutes from './routes/sucursal.routes';
import areaRoutes from './routes/area.routes';
import responsableRoutes from './routes/responsable.routes';
import reportesRoutes from './routes/reportes.routes';

// Cargar variables de entorno
config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger (debe ir antes de las rutas)
app.use(requestLoggerMiddleware);

// Swagger documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/inventario-nuevo', inventarioNuevoRoutes);
app.use('/api/auditoria', auditoriaRoutes);
app.use('/api/print', printRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/sucursales', sucursalRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/responsables', responsableRoutes);
app.use('/api/reportes', reportesRoutes);

// API info endpoint
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    message: 'API Activos Fijos - Backend',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      inventario: '/api/inventario',
      inventarioNuevo: '/api/inventario-nuevo',
      auditoria: '/api/auditoria',
      print: '/api/print',
      proyectos: '/api/proyectos',
      sucursales: '/api/sucursales',
      areas: '/api/areas',
      responsables: '/api/responsables',
      reportes: '/api/reportes',
    },
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
  });
});

// Error handler global (debe ir al final)
app.use(errorHandlerMiddleware);

// Inicializar conexión a base de datos y servidor
const startServer = async () => {
  try {
    // Inicializar TypeORM
    await AppDataSource.initialize();
    Logger.info('✅ Database connection established', {
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
    });

    // Iniciar servidor
    app.listen(PORT, () => {
      Logger.info(`🚀 Server running on http://localhost:${PORT}`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        healthCheck: `http://localhost:${PORT}/health`,
      });
    });
  } catch (error) {
    Logger.error('❌ Error starting server', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  }
};

// Iniciar servidor
startServer();

export default app;
