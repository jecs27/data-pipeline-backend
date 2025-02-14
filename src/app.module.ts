import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HotspotsModule } from './hotspots/hotspots.module';
import { HotspotsRestModule } from './hotspots-rest/hotspots-rest.module';

@Module({
  imports: [HotspotsModule, HotspotsRestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
