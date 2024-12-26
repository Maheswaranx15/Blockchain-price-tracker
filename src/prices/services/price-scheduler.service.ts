import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PriceAlertService } from './price-alert.service';

@Injectable()
export class PriceSchedulerService {
  constructor(private readonly priceAlertService: PriceAlertService) {}

  // Schedule price check every hour
  @Cron('0 * * * *') // Every hour
  async handleCron() {
    await this.priceAlertService.checkAndAlertPrice('ethereum');
    await this.priceAlertService.checkAndAlertPrice('matic-network');
  }
}
