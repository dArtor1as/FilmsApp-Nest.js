import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Req() req: { user: { sub: number } },
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const { reviewId, content } = createCommentDto;
    const userId = req.user.sub;
    return this.commentsService.createComment(userId, reviewId, content);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.commentsService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCommentDto: UpdateCommentDto) {
    const { content } = updateCommentDto;
    return this.commentsService.updateComment(Number(id), content);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.commentsService.deleteComment(Number(id));
  }
}
