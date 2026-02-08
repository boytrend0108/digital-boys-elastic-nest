import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { EslasticService } from '../eslastic/eslastic.service';
import { CreateMovieDto, MovieDocument } from './tdo/create-movie.tdo';
import { generateSuggestions } from './helpers/suggest.helper';

@Injectable()
export class MoviesService implements OnModuleInit {
  static readonly INDEX = 'movies';
  private readonly logger = new Logger(MoviesService.name);

  constructor(private readonly eslasticService: EslasticService) {}

  async onModuleInit() {
    const exists = await this.eslasticService.indexExists(MoviesService.INDEX);
    if (!exists) {
      await this.eslasticService.createIndex(MoviesService.INDEX, undefined, {
        properties: {
          name: { type: 'text' },
          title: { type: 'text' },
          description: { type: 'text' },
          suggest: { type: 'completion' },
        },
      });
      this.logger.log(`Index '${MoviesService.INDEX}' created`);
    }
  }

  async createMovie(dto: CreateMovieDto): Promise<Record<string, unknown>> {
    const document: MovieDocument = {
      ...dto,
      suggest: generateSuggestions(dto.name),
    };

    const response = await this.eslasticService.getClient().index({
      index: MoviesService.INDEX,
      body: document,
      refresh: true,
    });

    return response.body as Record<string, unknown>;
  }

  async getAllMovies(): Promise<Record<string, unknown>> {
    const response = await this.eslasticService.getClient().search({
      index: MoviesService.INDEX,
      body: { query: { match_all: {} } },
    });
    return response.body as Record<string, unknown>;
  }

  async suggestMovies(prefix: string): Promise<Record<string, unknown>> {
    const response = await this.eslasticService.getClient().search({
      index: MoviesService.INDEX,
      body: {
        suggest: {
          movie_suggest: {
            prefix,
            completion: {
              field: 'suggest',
              size: 5,
            },
          },
        },
      },
    });
    return response.body.suggest as Record<string, unknown>;
  }

  async searchMovies(query: string): Promise<Record<string, unknown>> {
    const response = await this.eslasticService.getClient().search({
      index: MoviesService.INDEX,
      body: {
        query: {
          multi_match: {
            query,
            fields: ['name', 'title', 'description'],
          },
        },
      },
    });
    return response.body as Record<string, unknown>;
  }
}
