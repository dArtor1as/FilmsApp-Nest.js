import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { DatabaseService } from '../database/database.service'; // Adjust as needed

describe('ReviewsService', () => {
  let service: ReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: DatabaseService, // Mock DatabaseService
          useValue: {
            // Add mock methods or properties here if ReviewsService uses any
          },
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
