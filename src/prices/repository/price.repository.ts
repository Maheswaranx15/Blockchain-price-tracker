import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Price } from '../entities/price.entity';
import axios from 'axios';

@Injectable()
export class PriceRepository extends Repository<Price> {
  constructor(private dataSource: DataSource) {
    super(Price, dataSource.createEntityManager());
  }

  // Custom method to get the average price for a specific chain in the last 24 hours
  async getAveragePriceForLast24Hours(chain: string): Promise<number> {
    const currentDate = new Date();
    const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    const result = await this.createQueryBuilder('price')
      .select('AVG(price.price)', 'averagePrice') // Use the correct column name
      .where('price.chain = :chain', { chain })
      .andWhere('price.timestamp >= :past24Hours', { past24Hours })
      .getRawOne();

    return result?.averagePrice ?? 0;
  }

  // Custom method to fetch price history for the last 24 hours, grouped by hour
  async getPriceHistoryGroupedByHour(chain: string): Promise<any[]> {
    const currentDate = new Date();
    const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    const priceHistory = await this.createQueryBuilder('price')
      .select('DATE_TRUNC(\'hour\', price.timestamp)', 'hour')
      .addSelect('AVG(price.price)', 'averagePrice') // Use the correct column name
      .where('price.chain = :chain', { chain })
      .andWhere('price.timestamp >= :past24Hours', { past24Hours })
      .groupBy('hour')
      .orderBy('hour', 'ASC')
      .getRawMany();

    return priceHistory;
  }

  // Custom method to fetch the latest price for a specific chain
  async getLatestPrice(chain: string): Promise<number> {
    const latestPrice = await this.createQueryBuilder('price')
      .select('price.price', 'latestPrice') // Use the correct column name
      .where('price.chain = :chain', { chain })
      .orderBy('price.timestamp', 'DESC')
      .getRawOne();

    return latestPrice?.latestPrice ?? 0;
  }

}
