import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'es7';
import type { IndexSettings, IndexMappings } from './tdo/create-index.tdo';

@Injectable()
export class EslasticService implements OnModuleInit {
  private readonly logger = new Logger(EslasticService.name);
  private esClient: Client;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.esClient = new Client({
      node:
        this.configService.get<string>('ELASTICSEARCH_NODE') ||
        'http://localhost:9200',
      auth: {
        username:
          this.configService.get<string>('ELASTICSEARCH_USERNAME') || 'elastic',
        password:
          this.configService.get<string>('ELASTICSEARCH_PASSWORD') ||
          'changeme',
      },
    });

    // Test the connection
    try {
      const health = await this.esClient.cluster.health();
      this.logger.debug(
        `Connected to Elasticsearch cluster: ${health.body.cluster_name}`,
      );
      this.logger.debug(`Cluster status: ${health.body.status}`);
    } catch (error) {
      this.logger.error(
        'Failed to connect to Elasticsearch:',
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  getClient(): Client {
    return this.esClient;
  }

  // Example: Check cluster health
  async getClusterHealth() {
    const health = await this.esClient.cluster.health();
    return health.body;
  }

  // Example: Get cluster info
  async getClusterInfo() {
    const info = await this.esClient.info();
    return info.body;
  }

  // Create an index
  async createIndex(
    indexName: string,
    settings?: IndexSettings,
    mappings?: IndexMappings,
  ) {
    try {
      const body: { settings?: IndexSettings; mappings?: IndexMappings } = {};

      if (settings) {
        body.settings = settings;
      }

      if (mappings) {
        body.mappings = mappings;
      }

      const response = await this.esClient.indices.create({
        index: indexName,
        body,
      });

      this.logger.log(`Index '${indexName}' created successfully`);
      return response.body;
    } catch (error) {
      this.logger.error(
        `Failed to create index '${indexName}':`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  // Check if index exists
  async indexExists(indexName: string): Promise<boolean> {
    const { body } = await this.esClient.indices.exists({ index: indexName });
    return body;
  }

  // List all indices
  async listIndices() {
    const response = await this.esClient.cat.indices({ format: 'json' });
    return response.body;
  }

  // Delete an index
  async deleteIndex(indexName: string) {
    try {
      const response = await this.esClient.indices.delete({
        index: indexName,
      });
      this.logger.log(`Index '${indexName}' deleted successfully`);
      return response.body;
    } catch (error) {
      this.logger.error(
        `Failed to delete index '${indexName}':`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }
}
