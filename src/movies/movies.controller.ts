import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './tdo/create-movie.tdo';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  async createMovie(@Body() body: CreateMovieDto) {
    return await this.moviesService.createMovie(body);
  }

  @Get()
  async getAllMovies() {
    return await this.moviesService.getAllMovies();
  }

  @Get('suggest')
  async suggest(@Query('q') q: string) {
    return await this.moviesService.suggestMovies(q);
  }

  @Get('search')
  async search(@Query('q') q: string) {
    return await this.moviesService.searchMovies(q);
  }
}
