import { Test, TestingModule } from '@nestjs/testing';
import { HotspotsResolver } from './hotspots.resolver';
import { HotspotsService } from './hotspots.service';

describe('HotspotsResolver', () => {
  let resolver: HotspotsResolver;
  let service: HotspotsService;

  beforeEach(async () => {
    const mockHotspotsService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByNeighborhood: jest.fn(),
      findByProximity: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HotspotsResolver,
        {
          provide: HotspotsService,
          useValue: mockHotspotsService,
        },
      ],
    }).compile();

    resolver = module.get<HotspotsResolver>(HotspotsResolver);
    service = module.get<HotspotsService>(HotspotsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated hotspots', async () => {
      const mockResult = {
        data: [{ id: '1' }, { id: '2' }],
        total: 2,
      };

      jest.spyOn(service, 'findAll').mockResolvedValue(mockResult);

      const result = await resolver.findAll(1, 10);

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('findOne', () => {
    it('should throw error if no id provided', () => {
      expect(() => resolver.findOne()).toThrow('You must provide an id');
    });

    it('should return a hotspot by id', async () => {
      const mockHotspot = { id: '1' };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockHotspot);

      const result = await resolver.findOne('1');

      expect(result).toEqual(mockHotspot);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should return null if no hotspot found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const result = await resolver.findOne('1');
      expect(result).toBeNull();
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('findByNeighborhood', () => {
    it('should throw error if no neighborhood provided', async () => {
      await expect(resolver.findByNeighborhood('', 1, 10)).rejects.toThrow(
        'Neighborhood is required',
      );
    });

    it('should return hotspots by neighborhood', async () => {
      const mockResult = {
        data: [{ id: '1' }, { id: '2' }],
        total: 2,
      };

      jest.spyOn(service, 'findByNeighborhood').mockResolvedValue(mockResult);

      const result = await resolver.findByNeighborhood(
        'Test Neighborhood',
        1,
        10,
      );

      expect(result).toEqual(mockResult);
      expect(service.findByNeighborhood).toHaveBeenCalledWith(
        'Test Neighborhood',
        1,
        10,
      );
    });
  });

  describe('findByProximity', () => {
    it('should throw error if latitude or longitude not provided', async () => {
      await expect(
        resolver.findByProximity(null, null, 1, 10, 5),
      ).rejects.toThrow('Latitude and longitude are required');
    });

    it('should return hotspots by proximity', async () => {
      const mockResult = {
        data: [{ id: '1' }, { id: '2' }],
        total: 2,
      };

      jest.spyOn(service, 'findByProximity').mockResolvedValue(mockResult);

      const result = await resolver.findByProximity(40.7128, -74.006, 1, 10, 5);

      expect(result).toEqual(mockResult);
      expect(service.findByProximity).toHaveBeenCalledWith(
        40.7128,
        -74.006,
        1,
        10,
        5,
      );
    });
  });
});
