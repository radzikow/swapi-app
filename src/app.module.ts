import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { FilmsModule } from './modules/films/films.module';
import { SpeciesModule } from './modules/species/species.module';
import { PlanetsModule } from './modules/planets/planets.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { StarshipsModule } from './modules/starships/starships.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from './shared/cache/cache.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    FilmsModule,
    SpeciesModule,
    PlanetsModule,
    VehiclesModule,
    StarshipsModule,
    MongooseModule.forRoot('mongodb://mongodb:27017/myDatabase'),
    CacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
