import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricesService } from './prices.service';
import { Price } from './entities/price.entity';
import { Alert } from './entities/alert.entity';
import { PriceRepository } from './repository/price.repository';
import { AlertRepository } from './repository/alert.repository';
import { DataSource } from 'typeorm';  // Import DataSource

@Module({
  imports: [
    TypeOrmModule.forFeature([Price, Alert, PriceRepository, AlertRepository]),  // Ensure all entities and repositories are included here
  ],
  providers: [
    PricesService,
    {
      provide: PriceRepository,
      useFactory: (dataSource: DataSource) => new PriceRepository(dataSource),
      inject: [DataSource],
    },
    {
      provide: AlertRepository,
      useFactory: (dataSource: DataSource) => new AlertRepository(dataSource),
      inject: [DataSource],
    },
  ],
  exports: [PricesService],
})
export class PricesModule {}
