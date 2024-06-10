import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { JSDOM } from 'jsdom';
import { GetNoticeDto } from './dto/get.dto';
import { DateTime } from 'luxon';

@Injectable()
export class NoticeService {
  private lastNotices = new Map<string, string>();

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async get({ year, scale, category }: GetNoticeDto) {
    const url = this.configService.get('MEISTER_NET_URL');

    year = year || undefined;
    scale = scale || undefined;

    const isCategory = !!category;
    category = isCategory ? category : '사이버보안';

    const response = [];

    const cybersecurity = await this.httpService.axiosRef(
      url + '/sub/3/6/4/informationSquare/enforceData.do',
      {
        method: 'POST',
        params: {
          competYear: year,
          competNm: scale,
          jobNm: category,
        },
      },
    );

    if (cybersecurity.status === 200) {
      response.push(...(await this.parse(cybersecurity.data)));
    }

    if (!isCategory) {
      category = '클라우드컴퓨팅';

      const cloudcomputing = await this.httpService.axiosRef(
        url + '/sub/3/6/4/informationSquare/enforceData.do',
        {
          method: 'POST',
          params: {
            competYear: year,
            competNm: scale,
            jobNm: category,
          },
        },
      );

      if (cloudcomputing.status === 200) {
        response.push(...(await this.parse(cloudcomputing.data)));
      }
    }

    return response;
  }

  async getLatestNotices() {
    const url = this.configService.get('MEISTER_NET_URL');
    const date = DateTime.now();
    const response = [];

    const cybersecurity = await this.httpService.axiosRef(
      url + '/sub/3/6/4/informationSquare/enforceData.do',
      {
        method: 'POST',
        params: {
          competYear: date.year.toString(),
          competNm: date.month <= 6 ? 'J' : 'P',
          jobNm: '사이버보안',
        },
      },
    );

    if (cybersecurity.status === 200) {
      response.push(...(await this.parse(cybersecurity.data)));
    }

    const cloudcomputing = await this.httpService.axiosRef(
      url + '/sub/3/6/4/informationSquare/enforceData.do',
      {
        method: 'POST',
        params: {
          competYear: date.year.toString(),
          competNm: date.month <= 6 ? 'J' : 'P',
          jobNm: '사이버보안',
        },
      },
    );

    if (cloudcomputing.status === 200) {
      response.push(...(await this.parse(cloudcomputing.data)));
    }

    return response;
  }

  async parse(htmlContent: string) {
    const url = this.configService.get('MEISTER_NET_URL');

    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    const notices = [];

    document.querySelectorAll('table tbody tr').forEach((tr) => {
      const tds = tr.querySelectorAll('td');
      notices.push({
        division: tds[4]?.textContent.trim(),
        title: tds[5]?.textContent.trim(),
        download: url + tds[8]?.querySelector('a')?.href,
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
        this.sendDiscordMessage(
          `📢 공개과제가 수정되었습니다.\n${url + '/sub/3/6/4/informationSquare/enforceData.do'}`,
        );
      }
      this.lastNotices.set(notice.title, notice.date);
    });
  }

  async sendDiscordMessage(msessage: string) {
    const webhookUrl = this.configService.get('DISCORD_WEBHOOK_URL');
    await this.httpService.axiosRef(webhookUrl, {
      method: 'POST',
      data: { content: msessage },
    });
  }
}
