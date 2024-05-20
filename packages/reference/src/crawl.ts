import axios from 'axios';

export const crawl = async () => {
  const date = new Date();
  const url = 'https://meister.hrdkorea.or.kr/sub/3/6/4/informationSquare/enforceData.do';

  const params = {
    competYear: date.getFullYear(),
    competNm: 'I', // J: 지방기능경기대회, P: 전국기능경기대회, I: 세계기능경기대회
    jobNm: '사이버보안',
  };

  const response = await axios.get(url, { params });
  return response.data;
};
