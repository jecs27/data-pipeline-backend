import { Test, TestingModule } from '@nestjs/testing';
import { HotspotsService } from './hotspots.service';
import { getDataSourceRepository } from '../database/create-database';

// Mock the getDataSourceRepository function
jest.mock('../database/create-database');

describe('HotspotsService', () => {
  let service: HotspotsService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    (getDataSourceRepository as jest.Mock).mockResolvedValue(mockRepository);

    const module: TestingModule = await Test.createTestingModule({
      providers: [HotspotsService],
    }).compile();

    service = module.get<HotspotsService>(HotspotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated hotspots', async () => {
      const mockHotspots = [
        { id: '1', program: 'Test Program 1' },
        { id: '2', program: 'Test Program 2' },
      ];
      const mockTotal = 2;

      mockRepository.find.mockResolvedValue(mockHotspots);
      mockRepository.count.mockResolvedValue(mockTotal);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        data: mockHotspots,
        total: mockTotal,
      });
      expect(mockRepository.find).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return a hotspot by id', async () => {
      const mockHotspot = { id: '1', program: 'Test Program' };
      mockRepository.findOne.mockResolvedValue(mockHotspot);

      const result = await service.findOne('1');

      expect(result).toEqual(mockHotspot);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return null if no hotspot found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne('1');
      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('findByNeighborhood', () => {
    it('should return hotspots by neighborhood', async () => {
      const mockHotspots = [
        { id: '1', neighborhood: 'Test Neighborhood' },
        { id: '2', neighborhood: 'Test Neighborhood' },
      ];
      const mockTotal = 2;

      mockRepository.find.mockResolvedValue(mockHotspots);
      mockRepository.count.mockResolvedValue(mockTotal);

      const result = await service.findByNeighborhood(
        'Test Neighborhood',
        1,
        10,
      );

      expect(result).toEqual({
        data: mockHotspots,
        total: mockTotal,
      });
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { neighborhood: 'Test Neighborhood' },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('findByProximity', () => {
    it('should return hotspots by proximity', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        clone: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([{ id: '1' }, { id: '2' }]),
        getCount: jest.fn().mockResolvedValue(2),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findByProximity(40.7128, -74.006, 1, 10, 5);

      expect(result).toEqual({
        data: [{ id: '1' }, { id: '2' }],
        total: 2,
      });
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('hotspot');
    });
  });
});
