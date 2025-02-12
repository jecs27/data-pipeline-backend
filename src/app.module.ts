import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HotspotsModule } from './hotspots/hotspots.module';

@Module({
  imports: [HotspotsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
