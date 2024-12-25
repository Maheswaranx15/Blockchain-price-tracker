import { Repository } from 'typeorm';
import { Price } from './entities/price.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PriceRepository extends Repository<Price> {

}
