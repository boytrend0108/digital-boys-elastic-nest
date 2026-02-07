import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'es7';

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
}
