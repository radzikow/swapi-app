import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { People } from './entities/people.entity';
import { Resource } from '../../common/enums/resource.enum';
import { GenericEntityService } from '../../shared/generic-entity.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PeopleService extends GenericEntityService<People> {
  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    super(httpService, configService, Resource.People);
  }

  async getCharacterNames(): Promise<string[]> {
    const { results: people } = await this.getAll(
      this.defaultSearch,
      this.defaultPaginationSkip,
      this.defaultPaginationTakeMax,
    );
    const characterNames: string[] = [];

    people.forEach((person) => {
      characterNames.push(person.name);
    });

    return characterNames;
  }
}
