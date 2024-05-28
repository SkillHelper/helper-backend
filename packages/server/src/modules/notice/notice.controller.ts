import { Controller, Get, UseGuards } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessGuard } from '../auth/guards/access.guard';

@Controller('notice')
@ApiTags('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get('/')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  async getNotice() {
    return await this.noticeService.get();
  }
}
