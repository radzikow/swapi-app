import { Test, TestingModule } from '@nestjs/testing';
import { StarshipsResolver } from './starships.resolver';
import { StarshipsService } from './starships.service';

describe('StarshipsResolver', () => {
  let resolver: StarshipsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StarshipsResolver, StarshipsService],
    }).compile();

    resolver = module.get<StarshipsResolver>(StarshipsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
