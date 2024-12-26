import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Price } from './entities/price.entity';
import { MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PricesService {
  getPricesForLast24Hours(chain: string) {
    throw new Error('Method not implemented.');
  }

  async getPrice(chain: string): Promise<number> {
    const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${chain}&vs_currencies=usd`;
    const response = await axios.get(apiUrl);
    return response.data[chain]?.usd ?? 0;
  }

}
