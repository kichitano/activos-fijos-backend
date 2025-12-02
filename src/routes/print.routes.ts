import { Router } from 'express';
import { PrintController } from '../controllers/PrintController';
import { authMiddleware, permissionsMiddleware, validateBody } from '../middlewares';
import { PrintLabelDto } from '../dtos/print';
import { UserRole } from '../entities/User';

const router = Router();
const printController = new PrintController();

/**
 * Rutas de Impresión de Etiquetas (placeholder)
 * TODO: Implementar funcionalidad real cuando se defina hardware
 */

/**
 * @route POST /api/print/label
 * @desc Imprimir etiqueta para activo fijo (placeholder - retorna 501)
 * @access REGISTRADOR, ADMINISTRADOR
 * @body PrintLabelDto
 */
router.post(
  '/label',
  authMiddleware,
  permissionsMiddleware([UserRole.ADMINISTRADOR, UserRole.REGISTRADOR]),
  validateBody(PrintLabelDto),
  printController.printLabel
);

export default router;
