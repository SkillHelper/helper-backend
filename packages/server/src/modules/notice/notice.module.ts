import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { HttpModule } from '@nestjs/axios';
@Module({
  controllers: [NoticeController],
  providers: [NoticeService],
  imports: [HttpModule],
})
export class NoticeModule {}
