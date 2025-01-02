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
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  create(
    @Req() req: { user: { sub: number; email: string } }, // Типізуємо прямо тут
    @Body() createRatingDto: CreateRatingDto,
  ) {
    const userId = req.user.sub;
    console.log(userId);
    return this.ratingsService.createRating(userId, createRatingDto);
  }

  @Get()
  findAll() {
    return this.ratingsService.getAllRatings();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.ratingsService.getRatingById(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRatingDto: UpdateRatingDto) {
    return this.ratingsService.updateRating(Number(id), updateRatingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.ratingsService.deleteRating(Number(id));
  }
}
