import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { FilmsModule } from './resources/films/films.module';
import { SpeciesModule } from './resources/species/species.module';
import { PlanetsModule } from './resources/planets/planets.module';
import { VehiclesModule } from './resources/vehicles/vehicles.module';
import { StarshipsModule } from './resources/starships/starships.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from './shared/cache/cache.module';
import { PeopleModule } from './resources/people/people.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    MongooseModule.forRoot(process.env.DB_MONGODB_URI),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    FilmsModule,
    SpeciesModule,
    PlanetsModule,
    VehiclesModule,
    StarshipsModule,
    CacheModule,
    PeopleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
