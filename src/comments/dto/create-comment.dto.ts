import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  @IsNotEmpty()
  reviewId: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1, {
    message: 'Comment content must be at least 1 character long',
  })
  content: string;
}
