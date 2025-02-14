import { Injectable } from '@nestjs/common';
import { getDataSourceRepository } from '../database/create-database';
import Hotspot from './entities/hotspot.entity';

// Earth's radius in kilometers used for Haversine formula
const EARTH_RADIUS_KM = 6371;

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

  async findOne(id?: string) {
    const repository = await getDataSourceRepository(Hotspot);
    const hotspotById = await repository.findOne({
      where: { id },
    });
    if (hotspotById) {
      return hotspotById;
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

  async findByProximity(
    latitude: number,
    longitude: number,
    page: number,
    limit: number,
    distance: number,
  ) {
    const repository = await getDataSourceRepository(Hotspot);
    const skip = (page - 1) * limit;

    // Haversine formula to calculate the distance between two points on a sphere
    const baseQuery = repository
      .createQueryBuilder('hotspot')
      .addSelect(
        `(
          :earthRadius * acos(
            cos(radians(:latitude)) * cos(radians(latitude)) *
            cos(radians(longitude) - radians(:longitude)) +
            sin(radians(:latitude)) * sin(radians(latitude))
          )
        )`,
        'distance',
      )
      .setParameter('earthRadius', EARTH_RADIUS_KM)
      .setParameter('latitude', latitude)
      .setParameter('longitude', longitude)
      .setParameter('maxDistance', distance)
      .where(
        `(
          :earthRadius * acos(
            cos(radians(:latitude)) * cos(radians(latitude)) *
            cos(radians(longitude) - radians(:longitude)) +
            sin(radians(:latitude)) * sin(radians(latitude))
          )
        ) < :maxDistance`,
      );

    const [data, total] = await Promise.all([
      baseQuery
        .clone()
        .orderBy('distance', 'ASC')
        .offset(skip)
        .limit(limit)
        .getRawMany(),
      baseQuery.clone().getCount(),
    ]);

    return { data, total };
  }
}
