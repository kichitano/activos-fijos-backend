import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO para renovar access token
 */
export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'El refreshToken es requerido' })
  refreshToken!: string;
}
