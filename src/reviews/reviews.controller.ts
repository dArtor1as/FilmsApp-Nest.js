import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  Param,
  Patch,
  Delete,
  UnauthorizedException,
  Render,
  Req,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @Render('reviews')
  async getAllReviews() {
    const reviews = await this.reviewsService.findAll();
    return { reviews };
  }

  @Get(':id')
  async getReview(@Param('id') id: number) {
    return this.reviewsService.findOne(id);
  }

  @Post()
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    return this.reviewsService.createReview(userId, createReviewDto);
  }

  @Patch(':id')
  async updateReview(
    @Param('id') id: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return this.reviewsService.update(id, updateReviewDto);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Delete(':id')
  async deleteReview(
    @Param('id') id: number,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return this.reviewsService.remove(id);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
