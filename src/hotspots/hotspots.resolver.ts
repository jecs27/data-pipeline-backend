import {
  Resolver,
  Query,
  Args,
  ObjectType,
  Field,
  Int,
  Float,
} from '@nestjs/graphql';
import { HotspotsService } from './hotspots.service';
import Hotspot from './entities/hotspot.entity';
import { PaginatedResponse } from '../utils/interfaces';

const DEFAULT_PAGE = process.env.DEFAULT_PAGE
  ? parseInt(process.env.DEFAULT_PAGE)
  : 1;
const DEFAULT_LIMIT = process.env.DEFAULT_LIMIT
  ? parseInt(process.env.DEFAULT_LIMIT)
  : 10;

// Maximum distance in kilometers for proximity search
const MAX_DISTANCE_KM = 10;

@ObjectType()
class HotspotPaginatedResponse implements PaginatedResponse<Hotspot> {
  @Field(() => [Hotspot])
  data: Hotspot[];

  @Field(() => Int)
  total: number;
}

@Resolver(() => Hotspot)
export class HotspotsResolver {
  constructor(private readonly hotspotsService: HotspotsService) {}

  @Query(() => HotspotPaginatedResponse, { name: 'hotspots' })
  async findAll(
    @Args('page', { type: () => Int, defaultValue: DEFAULT_PAGE })
    page: number = DEFAULT_PAGE,
    @Args('limit', { type: () => Int, defaultValue: DEFAULT_LIMIT })
    limit: number = DEFAULT_LIMIT,
  ): Promise<HotspotPaginatedResponse> {
    const result = await this.hotspotsService.findAll(page, limit);
    return {
      data: result.data as Hotspot[],
      total: result.total || 0,
    };
  }

  @Query(() => Hotspot, { name: 'hotspot' })
  findOne(@Args('id', { type: () => String, nullable: true }) id?: string) {
    if (!id) {
      throw new Error('You must provide an id');
    }
    return this.hotspotsService.findOne(id);
  }

  @Query(() => HotspotPaginatedResponse, { name: 'hotspotsByNeighborhood' })
  async findByNeighborhood(
    @Args('neighborhood', { type: () => String }) neighborhood: string,
    @Args('page', { type: () => Int, defaultValue: DEFAULT_PAGE })
    page: number,
    @Args('limit', { type: () => Int, defaultValue: DEFAULT_LIMIT })
    limit: number,
  ): Promise<HotspotPaginatedResponse> {
    if (!neighborhood) {
      throw new Error('Neighborhood is required');
    }
    const result = await this.hotspotsService.findByNeighborhood(
      neighborhood,
      page,
      limit,
    );
    return {
      data: result.data as Hotspot[],
      total: result.total,
    };
  }

  @Query(() => HotspotPaginatedResponse, { name: 'hotspotsByProximity' })
  async findByProximity(
    @Args('latitude', { type: () => Float }) latitude: number,
    @Args('longitude', { type: () => Float }) longitude: number,
    @Args('page', { type: () => Int, defaultValue: DEFAULT_PAGE })
    page: number,
    @Args('limit', { type: () => Int, defaultValue: DEFAULT_LIMIT })
    limit: number,
    @Args('distance', { type: () => Float, defaultValue: MAX_DISTANCE_KM })
    distance: number,
  ): Promise<HotspotPaginatedResponse> {
    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required');
    }
    const result = await this.hotspotsService.findByProximity(
      latitude,
      longitude,
      page,
      limit,
      distance,
    );
    return {
      data: result.data.filter(
        (hotspot): hotspot is Hotspot =>
          hotspot !== null && hotspot.id !== null && hotspot.id !== undefined,
      ),
      total: result.total,
    };
  }
}
