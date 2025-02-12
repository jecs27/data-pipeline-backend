import { Module } from '@nestjs/common';
import { HotspotsService } from './hotspots.service';
import { HotspotsResolver } from './hotspots.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ValidationPlugin } from '../plugins/validation.plugin';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      plugins: [new ValidationPlugin()],
    }),
  ],
  providers: [HotspotsResolver, HotspotsService],
})
export class HotspotsModule {}
