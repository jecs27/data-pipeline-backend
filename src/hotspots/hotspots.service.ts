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

  async findOne(id?: string, uuid?: string) {
    const repository = await getDataSourceRepository(Hotspot);

    if (id) {
      const hotspotById = await repository.findOne({
        where: { id },
      });
      if (hotspotById) {
        return hotspotById;
      }
    }

    if (uuid) {
      return repository.findOne({
        where: { uuid },
      });
    }

    return null;
  }

  async findByNeighborhood(neighborhood: string, page: number, limit: number) {
    const repository = await getDataSourceRepository(Hotspot);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      repository.find({
        where: { neighborhood },
        skip,
        take: limit,
      }),
      repository.count({ where: { neighborhood } }),
    ]);

    return { data, total };
  }
}
