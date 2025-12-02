import { IsUUID, IsNotEmpty } from 'class-validator';

/**
 * DTO para solicitud de impresión de etiqueta
 */
export class PrintLabelDto {
  @IsUUID('4', { message: 'El inventarioNuevoId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El inventarioNuevoId es requerido' })
  inventarioNuevoId!: string;
}
