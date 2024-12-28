import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { DatabaseService } from '../database/database.service';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: DatabaseService,
          useValue: {
            review: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should create a review', async () => {
    const mockReview = {
      id: 1,
      content: 'Great movie!',
      userId: 1,
      movieId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createReviewDto = {
      userId: 1,
      movieId: 1,
      content: 'Great movie!',
    };

    jest.spyOn(databaseService.review, 'create').mockResolvedValue(mockReview);

    const result = await service.createReview(createReviewDto);
    expect(result).toEqual(mockReview);
  });
});
