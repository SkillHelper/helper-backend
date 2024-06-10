import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessGuard } from '../auth/guards/access.guard';
import { GetNoticeDto } from './dto/get.dto';

@Controller('notice')
@ApiTags('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get('/')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  async getNotice(@Query() getNoticeDto: GetNoticeDto) {
    return await this.noticeService.get(getNoticeDto);
  }
}
