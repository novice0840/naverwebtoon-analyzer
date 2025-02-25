import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPromise, Webtoon } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { crawlingWebtoons } from 'src/common/utils/crawling';
import { PLATFORMS } from 'src/common/constants/webtoon';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class WebtoonService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private async crawlingAllWebtoons() {
    const crawlingResults = await Promise.allSettled(
      PLATFORMS.map((platform) =>
        crawlingWebtoons(platform, this.configService.get('KMAS_API_KEY')),
      ),
    );

    return crawlingResults
      .filter((result) => result.status === 'fulfilled')
      .flatMap((result) => result.value);
  }

  private async getWebtoon(title, writer, illustrator) {
    return await this.prisma.webtoon.findFirst({
      where: {
        title,
        writer,
        illustrator,
      },
      include: {
        platforms: {
          include: {
            platform: true,
          },
        },
      },
    });
  }

  private async addNewPlatform(webtoonId, platform) {
    return await this.prisma.webtoonPlatform.create({
      data: {
        webtoon: {
          connect: {
            id: webtoonId,
          },
        },
        platform: {
          connectOrCreate: {
            where: { name: platform },
            create: { name: platform },
          },
        },
      },
    });
  }

  private async createNewWebtoon(webtoon) {
    const { platform, ...webtoonData } = webtoon;
    await this.prisma.webtoon.create({
      data: {
        ...webtoonData,
        platforms: {
          create: {
            platform: {
              connectOrCreate: {
                where: { name: platform },
                create: { name: platform },
              },
            },
          },
        },
      },
    });
  }

  public async storeAllWebtoons() {
    try {
      const allWebtoons = await this.crawlingAllWebtoons();
      console.log(`${allWebtoons.length}개 웹툰 크롤링 완료 `);
      for (const webtoon of allWebtoons) {
        try {
          const existingWebtoon = await this.getWebtoon(
            webtoon.title,
            webtoon.writer,
            webtoon.illustrator,
          );

          if (existingWebtoon) {
            const isPlatformIncluded = existingWebtoon.platforms.some(
              (p) => p.platform.name === webtoon.platform,
            );
            if (isPlatformIncluded) continue;
            await this.addNewPlatform(existingWebtoon.id, webtoon.platform);
            continue;
          }

          const thumbnailURL = await this.uploadImage(webtoon.thumbnailURL);
          await this.createNewWebtoon({ ...webtoon, thumbnailURL });
          console.log(`Processed webtoon: ${webtoon.title}`);
        } catch (error) {
          console.error(`Failed to process webtoon: ${webtoon.title}`, error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async getWebtoons(page: number, platform: string) {
    const pageSize = 100; // 한 페이지당 100개
    const skip = (page - 1) * pageSize; // 페이지네이션을 위한 skip 계산

    // 📌 1. 총 개수 조회 (platform 필터 적용)
    const totalCount = await this.prisma.webtoon.count({
      where:
        platform !== 'all'
          ? {
              platforms: {
                some: {
                  platform: { name: platform },
                },
              },
            }
          : {},
    });

    // 📌 2. 총 페이지 수 계산
    const totalPage = Math.ceil(totalCount / pageSize);

    // 📌 3. 웹툰 목록 조회 (다대다 관계 필터링)
    const webtoons = await this.prisma.webtoon.findMany({
      where:
        platform !== 'all'
          ? {
              platforms: {
                some: {
                  platform: { name: platform },
                },
              },
            }
          : {},
      take: pageSize,
      skip: skip,
    });

    // 📌 4. `{ totalPage, curPage, data }` 형태로 반환
    return {
      totalPage,
      curPage: page,
      data: webtoons,
    };
  }

  private async uploadImage(imageUrl: string) {
    try {
      const uploadedUrl = await this.uploadImageToGCP(imageUrl);
      console.log(`🌍 최종 업로드된 이미지 URL: ${uploadedUrl}`);
      return uploadedUrl;
    } catch (error) {
      console.error(`🚨 업로드 실패: ${error.message}`);
    }
  }

  private async uploadImageToGCP(imageUrl) {
    const keyFilePath = path.resolve(
      __dirname,
      '../../../gcp-storage-key.json',
    );

    const storage = new Storage({
      keyFilename: keyFilePath,
    });
    const bucketName = this.configService.get('GCP_BUCKET_NAME');
    const response = await fetch(imageUrl);
    if (!response.ok)
      throw new Error(`이미지 다운로드 실패: ${response.statusText}`);

    const buffer = await response.arrayBuffer();
    const fileName = `thumbnails/${uuidv4()}.jpg`;
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);
    await file.save(Buffer.from(buffer), {
      contentType: response.headers.get('content-type') || 'image/jpeg',
      public: true,
    });
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    return publicUrl;
  }
}
