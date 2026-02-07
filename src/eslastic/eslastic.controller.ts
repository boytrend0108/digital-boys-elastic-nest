import { Controller, Get } from '@nestjs/common';
import { EslasticService } from './eslastic.service';

@Controller('eslastic')
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
}
