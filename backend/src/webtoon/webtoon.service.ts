import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { load } from 'cheerio';

@Injectable()
export class WebtoonService {
  private async getHtmlSelector(url) {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(url);
      const content = await page.content();
      console.log(content);
      await page.close();
      await browser.close();
      return load(content);
    } catch (error) {
      console.error(error);
    }
  }

  getAllWebtoon = async () => {
    const $ = await this.getHtmlSelector(
      'https://comic.naver.com/webtoon/weekday',
    );
    console.log($);
    const webtoonDataList = [];
    $('.thumb').each((i, element) => {
      const webtoonURL = new URL(
        'https://comic.naver.com/' + $(element).find('a').attr('href'),
      ); // Ex) link  = '/webtoon/list?titleId=793283&weekday=tue'
      const webtoonData = {
        titleId: webtoonURL.searchParams.get('titleId') ?? '',
        title: $(element).find('img').attr('title') ?? '',
        thumb: $(element).find('img').attr('src') ?? '',
        weekday: webtoonURL.searchParams.get('weekday') ?? '',
      };
      webtoonDataList.push(webtoonData);
    });
    return webtoonDataList;
  };
  async getLastChapter(titleId) {
    // const html = await this.getHtmlSelector(
    //   `https://comic.naver.com/webtoon/list?titleId=${titleId}`,
    // );
    // if (html === undefined) return -1;
    // const $ = load(html.data);
    // const lastChapter = $('tr td.title a')
    //   ?.first()
    //   ?.attr('onclick')
    //   ?.split("'");
    // // nclk_v2(event,'lst.title','758037','110') 형태의 문자열을 파싱한다
    // if (lastChapter === undefined) return -1;
    // return parseInt(lastChapter[lastChapter.length - 2]);
  }
  async getWebtoon(titleId) {
    // const webtoonData = {
    //   title: '웹툰 제목',
    //   thumb: '썸네일 링크',
    //   author: '작가명',
    //   description: '해당 웹툰에 대한 설명',
    //   contents: [],
    // };
    // const html = await this.getHtml(
    //   `https://comic.naver.com/webtoon/list?titleId=${titleId}`,
    // );
    // const lastChapter = await this.getLastChapter(titleId);
    // if (html === undefined || lastChapter === -1) return undefined;
    // // 웹툰이 한 페이지에 10개 씩 보여주므로 챕터의 총 갯수를 알면 페이지를 역계산할 수 있다
    // const pageNumber = Math.floor(lastChapter / 10) + 1;
    // const $ = load(html.data);
    // webtoonData['title'] = $('div.detail span.title').text();
    // webtoonData['thumb'] = $('div.thumb img').attr('src') ?? '';
    // webtoonData['author'] = $('div.detail span.wrt_nm').text();
    // webtoonData['description'] = $('div.detail p').text();
    // for (let i = 1; i < pageNumber + 1; i++) {
    //   const pageHtml = await this.getHtml(
    //     `https://comic.naver.com/webtoon/list?titleId=${titleId}&page=${i}`,
    //   );
    //   const $page = load(pageHtml?.data);
    //   $page('tbody tr').each((i, element) => {
    //     if ($page(element).find('td.title').text()) {
    //       // td 태그가 종종 광고나 다음화 링크인 경우가 있음
    //       const chapterURL =
    //         $page(element)?.find('td.title a')?.attr('onclick')?.split("'") ??
    //         '';
    //       // nclk_v2(event,'lst.title','758037','110') 형태의 문자열을 파싱한다
    //       webtoonData.contents.push({
    //         title: $page(element)?.find('img')?.attr('alt') ?? '',
    //         thumb: $page(element)?.find('img')?.attr('src') ?? '',
    //         chapter: parseInt(chapterURL[chapterURL.length - 2]),
    //       });
    //     }
    //   });
    // }
    // return webtoonData;
  }
  async getBestComments(titleId, chapter) {
    const bestComments = [];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
      `https://comic.naver.com/comment/comment?titleId=${titleId}&no=${chapter}`,
    );
    const content = await page.content();
    await page.close();
    await browser.close();
    const $ = load(content);
    const lists = $('li.u_cbox_comment');
    lists.each((index, list) => {
      const name = $(list).find('span.u_cbox_nick').text();
      const text = $(list).find('span.u_cbox_contents').text();
      const like = $(list).find('em.u_cbox_cnt_recomm').text();
      const dislike = $(list).find('em.u_cbox_cnt_unrecomm').text();
      const date = $(list).find('span.u_cbox_date').text();
      bestComments.push({ name, text, like, dislike, date });
    });
    return bestComments;
  }
}
