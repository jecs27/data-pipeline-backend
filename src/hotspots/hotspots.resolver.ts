import { Resolver, Query, Args, ObjectType, Field, Int } from '@nestjs/graphql';
import { HotspotsService } from './hotspots.service';
import Hotspot from './entities/hotspot.entity';
import { PaginatedResponse } from '../utils/interfaces';

const DEFAULT_PAGE = process.env.DEFAULT_PAGE
  ? parseInt(process.env.DEFAULT_PAGE)
  : 1;
const DEFAULT_LIMIT = process.env.DEFAULT_LIMIT
  ? parseInt(process.env.DEFAULT_LIMIT)
  : 10;

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
}
