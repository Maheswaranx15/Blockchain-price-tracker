import { Controller, Get, Param } from '@nestjs/common';
import { PricesService } from './prices.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Prices')
@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}
  @ApiOperation({ summary: 'Get the prices of the last 24 hours for a chain' })
  @ApiResponse({ status: 200, description: 'Prices fetched successfully' })
  @Get(':chain/last24hours')
  async getPricesForLast24Hours(@Param('chain') chain: string) {
    return this.pricesService.getPricesForLast24Hours(chain);
  }
}
