import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ExplanationService } from './explanation.service';
import { AccessGuard } from '../auth/guards/access.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateExplanationDto } from './dto/create-explanation.dto';

@Controller('explanation')
export class ExplanationController {
  constructor(private readonly explanationService: ExplanationService) {}

  @Get()
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  async getExplanation() {
    return await this.explanationService.findAll();
  }

  @Get(':uuid')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  async getExplanationByUUID(@Param('uuid') uuid: string) {
    return await this.explanationService.findOneByUUID(uuid);
  }

  @Post()
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  async createExplanation(@Body() body: CreateExplanationDto) {
    return await this.explanationService.create(body);
  }

  @Patch(':uuid')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  async updateExplanation(
    @Param('uuid') uuid: string,
    @Body() body: CreateExplanationDto,
  ) {
    return await this.explanationService.update(uuid, body);
  }

  @Delete(':uuid')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  async deleteExplanation(@Param('uuid') uuid: string) {
    return await this.explanationService.delete(uuid);
  }
}
