import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import {
  CreateDocumentDto,
  UpdateDocumentDto,
  SearchDocumentDto,
} from './tdo/create-document.tdo';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post(':index')
  async createDocument(
    @Param('index') index: string,
    @Body() body: CreateDocumentDto,
  ) {
    const response = await this.documentsService.createDocument(
      index,
      body.document,
      body.id,
    );

    return response;
  }

  @Get(':index')
  async getAllDocuments(@Param('index') index: string) {
    return await this.documentsService.getAllDocuments(index);
  }

  @Get(':index/:id')
  async getDocument(@Param('index') index: string, @Param('id') id: string) {
    return await this.documentsService.getDocument(index, id);
  }

  @Post(':index/_search')
  async searchDocuments(
    @Param('index') index: string,
    @Body() body: SearchDocumentDto,
  ) {
    return await this.documentsService.searchDocuments(
      index,
      body.query,
      body.size,
      body.from,
      body.sort,
    );
  }

  @Put(':index/:id')
  async updateDocument(
    @Param('index') index: string,
    @Param('id') id: string,
    @Body() body: UpdateDocumentDto,
  ) {
    return await this.documentsService.updateDocument(index, id, body.document);
  }

  @Delete(':index/:id')
  async deleteDocument(@Param('index') index: string, @Param('id') id: string) {
    return await this.documentsService.deleteDocument(index, id);
  }
}
