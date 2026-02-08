import { Module } from '@nestjs/common';
import { EslasticModule } from '../eslastic/eslastic.module';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  imports: [EslasticModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
