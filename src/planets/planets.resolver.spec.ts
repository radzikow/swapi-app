import { Test, TestingModule } from '@nestjs/testing';
import { PlanetsResolver } from './planets.resolver';
import { PlanetsService } from './planets.service';

describe('PlanetsResolver', () => {
  let resolver: PlanetsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanetsResolver, PlanetsService],
    }).compile();

    resolver = module.get<PlanetsResolver>(PlanetsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
