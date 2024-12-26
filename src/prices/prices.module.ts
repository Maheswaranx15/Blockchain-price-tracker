import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricesService } from './prices.service';
import { Price } from './entities/price.entity';
import { PriceScheduler } from './price-scheduler/price-scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PriceAlertService } from './services/price-alert.service';
import { PriceSchedulerService } from './services/price-scheduler.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Price]),
    ScheduleModule.forRoot(),
  ],
  providers: [PricesService, PriceScheduler, PriceSchedulerService,PriceAlertService],
  exports: [PricesService],
})
export class PricesModule {}
