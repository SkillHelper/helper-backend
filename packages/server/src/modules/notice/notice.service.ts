import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { JSDOM } from 'jsdom';
import { getNoticeDto } from './dto/get.dto';

@Injectable()
export class NoticeService {
  private lastNotices = new Map<string, string>();

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async get({ year, scale, category }: getNoticeDto) {
    const url = this.configService.get('MEISTER_NET_URL');
    const response = await this.httpService.axiosRef(url, {
      method: 'GET',
      params: {
        competYear: year,
        competNm: scale,
        jobNm: category,
      },
    });

    if (response.status === 200) {
      return await this.parse(response.data);
    }
  }

  async getLatestNotices() {
    const url = this.configService.get('MEISTER_NET_URL');
    const date = new Date();
    const response = await this.httpService.axiosRef(url, {
      method: 'GET',
      params: {
        competYear: date.getFullYear(),
        competNm: date.getMonth() <= 6 ? 'J' : 'P',
        jobNm: '사이버보안',
      },
    });

    if (response.status === 200) {
      return this.parse(response.data);
    }
  }

  async parse(htmlContent: string) {
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    const notices = [];

    document.querySelectorAll('table tbody tr').forEach((tr) => {
      const tds = tr.querySelectorAll('td');
      notices.push({
        title: tds[4]?.textContent.trim(),
        date: tds[7]?.textContent.trim(),
      });
    });

    return notices;
  }

  @Cron('0 0 * * * 1-5')
  async modifyNotice() {
    const notices = await this.getLatestNotices();
    const url = this.configService.get('MEISTER_NET_URL');

    notices.forEach((notice) => {
      const lastDate = this.lastNotices.get(notice.title);
      if (lastDate !== notice.date && notice.title === '공개과제') {
        this.sendDiscordMessage(`📢 공개과제가 수정되었습니다.\n${url}`);
      }
      this.lastNotices.set(notice.title, notice.date);
    });
  }

  async sendDiscordMessage(msessage: string) {
    const webhookUrl = this.configService.get('DISCORD_WEBHOOK_URL');
    await this.httpService.axiosRef;
    await this.httpService.axiosRef(webhookUrl, {
      method: 'POST',
      data: { content: msessage },
    });
  }
}
