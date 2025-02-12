import * as fs from 'fs';
import * as csv from 'csv-parse';
import * as path from 'path';
import { dataSource } from '../create-database';
import Hotspot from '../../hotspots/entities/hotspot.entity';

async function seed() {
  try {
    await dataSource.initialize();
    const repository = dataSource.getRepository(Hotspot);

    await repository.clear();

    const csvPath = path.join(__dirname, 'hotspots.csv');
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at: ${csvPath}`);
    }

    const parser = fs
      .createReadStream(csvPath)
      .pipe(csv.parse({ columns: true, delimiter: ',' }));

    const batchSize = 1000;
    let batch = [];

    for await (const record of parser) {
      const hotspot = new Hotspot();
      hotspot.id = record.id;
      hotspot.program = record.programa;
      hotspot.installationDate =
        record.fecha_instalacion === 'NA' ? null : record.fecha_instalacion;
      hotspot.latitude = parseFloat(record.latitud);
      hotspot.longitude = parseFloat(record.longitud);

      batch.push(hotspot);
      if (batch.length >= batchSize) {
        await repository.save(batch);
        batch = [];
      }
    }

    if (batch.length > 0) {
      await repository.save(batch);
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed();
