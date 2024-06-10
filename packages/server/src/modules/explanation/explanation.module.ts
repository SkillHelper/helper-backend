import { Module } from '@nestjs/common';
import { ExplanationService } from './explanation.service';
import { ExplanationController } from './explanation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Explanation } from './entities/explanation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Explanation])],
  controllers: [ExplanationController],
  providers: [ExplanationService],
})
export class ExplanationModule {}
