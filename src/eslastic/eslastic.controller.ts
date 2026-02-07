import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { EslasticService } from './eslastic.service';
import { CreateIndexDto } from './tdo/create-index.tdo';

@Controller('elastic')
export class EslasticController {
  constructor(private readonly eslasticService: EslasticService) {}

  @Get('health')
  async getHealth() {
    return await this.eslasticService.getClusterHealth();
  }

  @Get('info')
  async getInfo() {
    return await this.eslasticService.getClusterInfo();
  }

  @Get('indices')
  async listIndices() {
    return await this.eslasticService.listIndices();
  }

  @Get('indices/:name')
  async checkIndex(@Param('name') name: string) {
    const exists = await this.eslasticService.indexExists(name);
    return { index: name, exists };
  }

  @Post('indices')
  async createIndex(
    @Body()
    body: CreateIndexDto,
  ) {
    return await this.eslasticService.createIndex(
      body.name,
      body.settings,
      body.mappings,
    );
  }

  @Delete('indices/:name')
  async deleteIndex(@Param('name') name: string) {
    return await this.eslasticService.deleteIndex(name);
  }
}
