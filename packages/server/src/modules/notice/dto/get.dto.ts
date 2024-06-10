import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetNoticeDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  year?: string; // 년도

  @ApiProperty()
  @IsString()
  @IsOptional()
  scale?: string; // J: 지방기능경기대회, P: 전국기능경기대회, I: 세계기능경기대회

  @ApiProperty()
  @IsString()
  @IsOptional()
  category?: string; // 직종
}
