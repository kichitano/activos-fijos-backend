import { Logger } from "../utils/logger";
import { Request, Response } from 'express';
import { InventarioService } from '../services/InventarioService';

/**
 * Controlador de Inventario histórico (solo lectura)
 * Accesible para REGISTRADOR, COORDINADOR y ADMINISTRADOR
 */
export class InventarioController {
  private inventarioService: InventarioService;

  constructor() {
    this.inventarioService = new InventarioService();
  }

  /**
   * GET /api/inventario?codPatrimonial=XXX&codEtiqueta=YYY&codAf=ZZZ
   * Buscar por código patrimonial, etiqueta o AF
   */
  find = async (req: Request, res: Response): Promise<void> => {
    try {
      const { codPatrimonial, codEtiqueta, codAf } = req.query;

      let inventario = null;

      // Buscar por código patrimonial (prioridad 1)
      if (codPatrimonial) {
        inventario = await this.inventarioService.findByCodPatrimonial(codPatrimonial as string);
      }
      // Buscar por código etiqueta (prioridad 2)
      else if (codEtiqueta) {
        inventario = await this.inventarioService.findByCodEtiqueta(codEtiqueta as string);
      }
      // Buscar por código AF (prioridad 3)
      else if (codAf) {
        inventario = await this.inventarioService.findByCodAf(codAf as string);
      }
      else {
        res.status(400).json({
          message: 'Debe proporcionar al menos uno de: codPatrimonial, codEtiqueta o codAf',
        });
        return;
      }

      if (!inventario) {
        res.status(404).json({ message: 'Activo no encontrado en inventario histórico' });
        return;
      }

      res.status(200).json(inventario);
    } catch (error) {
      Logger.error('Error en InventarioController.find', { error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  /**
   * GET /api/inventario/:id
   * Obtener detalle completo por ID
   */
  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: 'Falta el parámetro id' });
        return;
      }

      const inventario = await this.inventarioService.findById(id);

      if (!inventario) {
        res.status(404).json({ message: 'Activo no encontrado' });
        return;
      }

      res.status(200).json(inventario);
    } catch (error) {
      Logger.error('Error en InventarioController.findById', { error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  /**
   * GET /api/inventario/:id/detail
   * Obtener detalle completo de un inventario con su inventario_nuevo relacionado
   */
  getDetail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: 'Falta el parámetro id' });
        return;
      }

      const detail = await this.inventarioService.getInventarioDetail(id);

      if (!detail) {
        res.status(404).json({ message: 'Activo no encontrado' });
        return;
      }

      res.status(200).json(detail);
    } catch (error) {
      Logger.error('Error en InventarioController.getDetail', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  /**
   * GET /api/inventario/search?q=texto
   * Búsqueda general por descripción, marca, modelo, serie
   */
  search = async (req: Request, res: Response): Promise<void> => {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string' || q.trim().length < 3) {
        res.status(400).json({
          message: 'El parámetro de búsqueda "q" es requerido y debe tener al menos 3 caracteres',
        });
        return;
      }

      const limit = parseInt(req.query.limit as string) || 50;

      const resultados = await this.inventarioService.search(q, limit);

      res.status(200).json({
        resultados,
        total: resultados.length,
        query: q,
      });
    } catch (error) {
      Logger.error('Error en InventarioController.search', { error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  /**
   * GET /api/inventario/:codigoEtiqueta/full-details
   * Obtener detalles completos del activo con datos para formulario de registro
   * Busca por código de etiqueta (usado en escaneo QR/barcode)
   */
  getFullDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const { codigoEtiqueta } = req.params;

      console.log('[InventarioController] getFullDetails - codigoEtiqueta recibido:', codigoEtiqueta);

      if (!codigoEtiqueta) {
        res.status(400).json({ message: 'Falta el parámetro codigoEtiqueta' });
        return;
      }

      const details = await this.inventarioService.getFullDetails(codigoEtiqueta);

      if (!details) {
        console.log('[InventarioController] No se encontraron detalles para:', codigoEtiqueta);
        res.status(404).json({ message: 'Activo no encontrado en inventario histórico' });
        return;
      }

      console.log('[InventarioController] Detalles encontrados para:', codigoEtiqueta);
      res.status(200).json(details);
    } catch (error) {
      Logger.error('Error en InventarioController.getFullDetails', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  /**
   * GET /api/inventario/patrimonial/:codigoPatrimonial/full-details
   * Obtener detalles completos del activo con datos para formulario de registro
   * Busca por código patrimonial (usado en búsqueda manual)
   */
  getFullDetailsByPatrimonial = async (req: Request, res: Response): Promise<void> => {
    try {
      const { codigoPatrimonial } = req.params;

      console.log('[InventarioController] getFullDetailsByPatrimonial - codigoPatrimonial recibido:', codigoPatrimonial);

      if (!codigoPatrimonial) {
        res.status(400).json({ message: 'Falta el parámetro codigoPatrimonial' });
        return;
      }

      const details = await this.inventarioService.getFullDetailsByPatrimonial(codigoPatrimonial);

      if (!details) {
        console.log('[InventarioController] No se encontraron detalles para:', codigoPatrimonial);
        res.status(404).json({ message: 'Activo no encontrado en inventario histórico' });
        return;
      }

      console.log('[InventarioController] Detalles encontrados para:', codigoPatrimonial);
      res.status(200).json(details);
    } catch (error) {
      Logger.error('Error en InventarioController.getFullDetailsByPatrimonial', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  /**
   * GET /api/inventario/dropdowns
   * Obtener listas para dropdowns (para registro de activos sin origen)
   */
  getDropdowns = async (_req: Request, res: Response): Promise<void> => {
    try {
      const dropdowns = await this.inventarioService.getDropdowns();
      res.status(200).json({ dropdowns });
    } catch (error) {
      Logger.error('Error en InventarioController.getDropdowns', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  /**
   * GET /api/inventario/mis-registros
   * Obtener registros del usuario actual
   * Incluye activos encontrados del inventario histórico y nuevos activos sin origen
   * Si el usuario es REGISTRADOR, filtra por su proyecto
   */
  getMisRegistros = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.rol;
      const userProyectoId = req.user?.proyecto_id;

      if (!userId || !userRole) {
        res.status(401).json({ message: 'Usuario no autenticado' });
        return;
      }

      const registros = await this.inventarioService.getMisRegistros(
        userId,
        userRole,
        userProyectoId
      );
      res.status(200).json(registros);
    } catch (error) {
      Logger.error('Error en InventarioController.getMisRegistros', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  /**
   * GET /api/inventario/buscar-todos?q=query&limit=50&offset=0&proyectoId=xxx
   * Buscar en todos los registros (inventario base + inventario_nuevo sin origen)
   * Si el usuario es REGISTRADOR, filtra por su proyecto
   * Parámetros opcionales:
   * - q: búsqueda por cod_patrimonial, cod_etiqueta o descripción
   * - proyectoId: filtro por proyecto (solo para ADMIN/COORDINADOR)
   */
  buscarTodos = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.rol;
      const userProyectoId = req.user?.proyecto_id;

      if (!userId || !userRole) {
        res.status(401).json({ message: 'Usuario no autenticado' });
        return;
      }

      const { q, proyectoId } = req.query;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const resultados = await this.inventarioService.buscarTodos(
        userId,
        userRole,
        userProyectoId,
        q as string | undefined,
        limit,
        offset,
        proyectoId as string | undefined
      );

      res.status(200).json(resultados);
    } catch (error) {
      Logger.error('Error en InventarioController.buscarTodos', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
}
