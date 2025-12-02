import { Request, Response } from 'express';
import { PrintService } from '../services/PrintService';
import { Logger } from '../utils/logger';

/**
 * Controlador de Impresión de Etiquetas (placeholder)
 */
export class PrintController {
  private printService: PrintService;

  constructor() {
    this.printService = new PrintService();
  }

  /**
   * POST /api/print/label
   * Imprimir etiqueta para activo fijo (placeholder - retorna 501)
   */
  printLabel = async (req: Request, res: Response): Promise<void> => {
    try {
      // Obtener userId del token JWT
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ message: 'No autenticado' });
        return;
      }

      // El body ya viene validado por validateBody middleware
      const { inventarioNuevoId } = req.body;

      // Intentar imprimir (lanzará error 501)
      await this.printService.printLabel(inventarioNuevoId, userId);

      // Este código nunca se alcanza porque printLabel siempre lanza error 501
      res.status(200).json({ message: 'Etiqueta impresa correctamente' });
    } catch (error) {
      if (error instanceof Error) {
        const statusCode = (error as any).statusCode || 500;

        if (statusCode === 501) {
          res.status(501).json({
            message: error.message,
            status: 'NOT_IMPLEMENTED',
            details:
              'La funcionalidad de impresión está pendiente de implementación. ' +
              'Se requiere definir el modelo de impresora y protocolo de comunicación.',
          });
        } else if (error.message.includes('no existe')) {
          res.status(404).json({ message: error.message });
        } else {
          Logger.error('Error en PrintController.printLabel', {
            error: error.message,
            stack: error.stack,
            userId: req.user?.userId,
          });
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      }
    }
  };
}
