import { Controller, Get } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { crawl } from 'reference/lib/crawl';
@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get()
  crawl() {
    return crawl();
  }
}


