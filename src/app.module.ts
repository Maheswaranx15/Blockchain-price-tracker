import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PricesModule } from './prices/prices.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from './prices/entities/price.entity';
import { PricesController } from './prices/prices.controller';
import { PricesService } from './prices/prices.service';
import { PriceAlertService } from './prices/services/price-alert.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: 'localhost', //docker : db //local na localhost
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [Price],
      synchronize: true,   
    }),
    PricesModule, 
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController,PricesController], 
  providers: [AppService,PricesService, PriceAlertService],
})
export class AppModule {}
