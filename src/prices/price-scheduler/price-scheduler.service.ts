import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PricesService } from '../prices.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Price } from '../entities/price.entity';
import { PriceRepository } from '../repository/price.repository';

@Injectable()
export class PriceScheduler {
  constructor(
    private readonly pricesService: PricesService,
    @InjectRepository(Price) // Correctly inject the repository
    private readonly PriceRepository: Repository<Price>,

  ) {}

  @Cron('0 */5 * * * *') // Every 5 minutes
  async fetchAndStorePrices() {
    const chains = ['ethereum', 'matic-network'];

    for (const chain of chains) {
      const price = await this.pricesService.getPrice(chain);
      await this.PriceRepository.save({
        chain,
        price,
      });

      console.log(`Saved price for ${chain}: $${price}`);
    }
  }
}
