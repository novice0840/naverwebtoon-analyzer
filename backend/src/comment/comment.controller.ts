import { Controller, Get } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  getUser(): string {
    return 'get user information';
  }
}
