import { Injectable } from '@nestjs/common';
import { getDataSourceRepository } from 'src/database/create-database';
import Hotspot from './entities/hotspot.entity';

@Injectable()
export class HotspotsService {
  async findAll(page: number, limit: number, withTotal = false) {
    const repository = await getDataSourceRepository(Hotspot);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      repository.find({
        skip,
        take: limit,
      }),
      withTotal ? repository.count() : Promise.resolve(undefined),
    ]);

    return { data, total };
  }
}
