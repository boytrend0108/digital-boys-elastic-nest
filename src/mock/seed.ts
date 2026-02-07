import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { EslasticService } from '../eslastic/eslastic.service';
import { moviesMock, MOVIES_INDEX } from './movies.mock';

async function seed() {
  const logger = new Logger('Seed');
  const app = await NestFactory.createApplicationContext(AppModule);
  const eslasticService = app.get(EslasticService);
  const client = eslasticService.getClient();

  // Create the movies index if it doesn't exist
  const indexExists = await eslasticService.indexExists(MOVIES_INDEX);

  if (!indexExists) {
    await eslasticService.createIndex(MOVIES_INDEX, undefined, {
      properties: {
        name: { type: 'text' },
        title: { type: 'text' },
        description: { type: 'text' },
      },
    });
    logger.log(`Index '${MOVIES_INDEX}' created`);
  } else {
    logger.log(`Index '${MOVIES_INDEX}' already exists, skipping creation`);
  }

  // Index all movies
  const body = moviesMock.flatMap((movie) => [
    { index: { _index: MOVIES_INDEX } },
    movie,
  ]);

  const result = await client.bulk({ body, refresh: true });

  if (result.body.errors) {
    logger.error('Some documents failed to index');
    const items = result.body.items as {
      index?: { error?: unknown };
    }[];
    const errorItems = items.filter((item) => item.index?.error);
    logger.error(JSON.stringify(errorItems, null, 2));
  } else {
    logger.log(`Successfully indexed ${moviesMock.length} movies`);
  }

  await app.close();
}

void seed();
