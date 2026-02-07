import { Injectable, Logger } from '@nestjs/common';
import { EslasticService } from '../eslastic/eslastic.service';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(private readonly eslasticService: EslasticService) {}

  async createDocument(
    index: string,
    document: Record<string, unknown>,
    id?: string,
  ) {
    try {
      const response = await this.eslasticService.getClient().index({
        index,
        id,
        body: document,
      });

      this.logger.log(
        `Document indexed in '${index}' with id '${response.body._id}'`,
      );

      return response.body;
    } catch (error) {
      this.logger.error(
        `Failed to index document in '${index}':`,
        error instanceof Error ? error.message : String(error),
      );

      throw error;
    }
  }

  async getAllDocuments(index: string) {
    try {
      const response = await this.eslasticService.getClient().search({
        index,
        body: { query: { match_all: {} } },
      });
      return response.body;
    } catch (error) {
      this.logger.error(
        `Failed to get all documents from '${index}':`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  async getDocument(index: string, id: string) {
    try {
      const response = await this.eslasticService.getClient().get({
        index,
        id,
      });
      return response.body;
    } catch (error) {
      this.logger.error(
        `Failed to get document '${id}' from '${index}':`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  async searchDocuments(
    index: string,
    query: Record<string, unknown>,
    size?: number,
    from?: number,
    sort?: Record<string, unknown>[],
  ) {
    try {
      const body: Record<string, unknown> = { query };

      if (size !== undefined) {
        body.size = size;
      }
      if (from !== undefined) {
        body.from = from;
      }
      if (sort) {
        body.sort = sort;
      }

      const response = await this.eslasticService.getClient().search({
        index,
        body,
      });
      return response.body;
    } catch (error) {
      this.logger.error(
        `Failed to search documents in '${index}':`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  async updateDocument(
    index: string,
    id: string,
    document: Record<string, unknown>,
  ) {
    try {
      const response = await this.eslasticService.getClient().update({
        index,
        id,
        body: { doc: document },
      });
      this.logger.log(`Document '${id}' updated in '${index}'`);
      return response.body;
    } catch (error) {
      this.logger.error(
        `Failed to update document '${id}' in '${index}':`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  async deleteDocument(index: string, id: string) {
    try {
      const response = await this.eslasticService.getClient().delete({
        index,
        id,
      });
      this.logger.log(`Document '${id}' deleted from '${index}'`);
      return response.body;
    } catch (error) {
      this.logger.error(
        `Failed to delete document '${id}' from '${index}':`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }
}
