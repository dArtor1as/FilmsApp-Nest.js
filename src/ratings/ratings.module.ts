import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [RatingsController],
  providers: [RatingsService, DatabaseService],
})
export class RatingsModule {}
