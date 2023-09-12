import { Entity, Column, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Comment } from './comment.entity';
import { Genre } from './Genre.entity';
import { Author } from './Author.entity';
import { DayOfWeek } from './DayOfWeek.entity';

@Entity()
@Unique(['titleId', 'platform'])
export class Webtoon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'title_id' })
  titleId: string;

  @Column()
  platform: string;

  @Column({ name: 'title_name' })
  titleName: string;

  @Column()
  thumbnail: string;

  @Column({ name: 'interest_count', default: 0 })
  interestCount: number;

  @Column({ type: 'float', name: 'star_score', default: 0 })
  starScore: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @Column({ name: 'like_count', default: 0 })
  likeCount: number;

  @Column({ name: 'is_end' })
  isEnd: boolean;

  @Column()
  link: string;

  @OneToMany(() => Comment, (comment) => comment.webtoon)
  comments: Comment[];

  @OneToMany(() => Genre, (genre) => genre.webtoon)
  genres: Genre[];

  @OneToMany(() => Author, (author) => author.webtoon)
  authors: Author[];

  @OneToMany(() => DayOfWeek, (dayOfweek) => dayOfweek.webtoon)
  dayOfWeeks: DayOfWeek[];
}
