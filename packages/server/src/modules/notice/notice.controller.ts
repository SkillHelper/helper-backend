import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessGuard } from '../auth/guards/access.guard';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getNoticeDto } from './dto/get.dto';

@Controller('notice')
@ApiTags('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post('/')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  async getNotice(@Body() getNoticeDto: getNoticeDto) {
    return await this.noticeService.get(getNoticeDto);
  }
}
