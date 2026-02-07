import { Module } from '@nestjs/common';
import { EslasticModule } from '../eslastic/eslastic.module';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

@Module({
  imports: [EslasticModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
