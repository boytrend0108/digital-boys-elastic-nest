import { Module } from '@nestjs/common';
import { EslasticService } from './eslastic.service';
import { EslasticController } from './eslastic.controller';

@Module({
  controllers: [EslasticController],
  providers: [EslasticService],
  exports: [EslasticService],
})
export class EslasticModule {}
