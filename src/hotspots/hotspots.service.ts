import { Injectable } from '@nestjs/common';
import { getDataSourceRepository } from 'src/database/create-database';
import Hotspot from './entities/hotspot.entity';

@Injectable()
export class HotspotsService {
  async findAll(page: number, limit: number) {
    const repository = await getDataSourceRepository(Hotspot);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      repository.find({
        skip,
        take: limit,
      }),
      repository.count(),
    ]);

    return { data, total };
  }

  async findOne(idOrUuid: string) {
    const repository = await getDataSourceRepository(Hotspot);
    return repository.findOne({
      where: [{ id: idOrUuid }, { uuid: idOrUuid }],
    });
  }
}
