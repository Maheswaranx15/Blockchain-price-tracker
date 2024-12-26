import { Test, TestingModule } from '@nestjs/testing';
import { PriceScheduler } from './price-scheduler.service';

describe('PriceSchedulerService', () => {
  let service: PriceScheduler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PriceScheduler],
    }).compile();

    service = module.get<PriceScheduler>(PriceScheduler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
