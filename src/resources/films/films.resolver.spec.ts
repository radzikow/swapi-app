import { Test, TestingModule } from '@nestjs/testing';
import { FilmsResolver } from './films.resolver';
import { FilmsService } from './films.service';
import { HttpModule } from '@nestjs/axios';
import { SpeciesModule } from '../species/species.module';
import { CacheModule } from 'src/shared/cache/cache.module';
import { PeopleModule } from '../people/people.module';

describe('FilmsResolver', () => {
  let resolver: FilmsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, SpeciesModule, CacheModule, PeopleModule],
      providers: [FilmsResolver, FilmsService],
    }).compile();

    resolver = module.get<FilmsResolver>(FilmsResolver);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // TODO: Add tests for the rest of the resolver methods

  // describe('getFilms', () => {
});
