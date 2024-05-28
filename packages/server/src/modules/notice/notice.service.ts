import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';

@Injectable()
export class NoticeService {
  constructor(private readonly httpService: HttpService) {}

  async get() {
    const date = new Date();
    const url =
      'https://meister.hrdkorea.or.kr/sub/3/6/4/informationSquare/enforceData.do';
    const params = {
      competYear: date.getFullYear(),
      competNm: 'J', // J: 지방기능경기대회, P: 전국기능경기대회, I: 세계기능경기대회
      jobNm: '사이버보안',
    };

    const response = await this.httpService.axiosRef({
      method: 'GET',
      url,
      params,
    });

    if (response.status === 200) {
      return await this.parse(response.data);
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
}
