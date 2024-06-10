import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateExplanationDto {
  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsString()
  readonly link: string;
}
