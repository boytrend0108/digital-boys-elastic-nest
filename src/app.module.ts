import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EslasticModule } from './eslastic/eslastic.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EslasticModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
