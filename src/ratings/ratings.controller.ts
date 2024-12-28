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

  // @Post()
  // create(@Body() createRatingDto: CreateRatingDto) {
  //   return this.ratingsService.createRating(createRatingDto);
  // }

  @Post()
  create(@Req() req: any, @Body() createRatingDto: CreateRatingDto) {
    const userId = req.user.sub;
    console.log(userId);
    return this.ratingsService.createRating(userId, createRatingDto);
  }

  /*@Get()
  @Render('films')
  async findAll(@Query('genre') genre?: string, @Query('title') title?: string) {
    const films = await this.filmsService.findAll(genre, title);
    const genres = await this.filmsService.findAllGenres(); // Отримання жанрів з бази даних
    return { films, genres };
  } */
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
