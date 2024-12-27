import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PricesService } from './prices.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Prices')
@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}
 
  //API to get latest crypto pricex
  @Get('latest')
  @ApiOperation({ summary: 'Get the latest price for a specific chain' })
  @ApiResponse({ status: 200, description: 'Latest price fetched successfully' })
  async getLatestPrice(@Query('chain') chain: string) {
    if (!chain) {
      throw new Error('Chain parameter is required');
    }
  
    const price = await this.pricesService.getPrice(chain);
    return { chain, price };
  }

  //Get the prices of the last 24 hours for a chain
  @ApiOperation({ summary: 'Get the prices of the last 24 hours for a chain' })
  @ApiResponse({ status: 200, description: 'Prices fetched successfully' })
  @Get(':chain/last24hours')
  async getPricesForLast24Hours(@Param('chain') chain: string) {
    return this.pricesService.getPriceHistory(chain);
  }

  @ApiOperation({ summary: 'Get the current ETH to BTC swap rate with fee' })
  @ApiResponse({ status: 200, description: 'Swap rate with fee fetched successfully' })
  @Get('swap-rate')
  async getSwapRateWithFee(
    @Query('ethAmount') ethAmount: number,
  ) {
    if (!ethAmount || ethAmount <= 0) {
      throw new Error('ETH amount must be a positive number');
    }

    const result = await this.pricesService.getSwapRateWithFee(ethAmount);
    return result;
  }
  
  @Get('history/:chain')
  async getPriceHistory(@Param('chain') chain: string) {
    return this.pricesService.getPriceHistory(chain);
  }

  @ApiOperation({ summary: 'Set a price alert' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        chain: { type: 'string', example: 'bitcoin' },
        price: { type: 'number', example: 50000 },
        email: { type: 'string', example: 'user@example.com' },
      },
    },
  })
 
  @ApiOperation({ summary: 'Get the BTC to ETH swap rate with fee' })
  @ApiResponse({ status: 200, description: 'Swap rate with fee fetched successfully' })
  @Get('swap-rate-btc-to-eth')
  async getSwapRateBtcToEthWithFee(
    @Query('btcAmount') btcAmount: number,
  ) {
    if (!btcAmount || btcAmount <= 0) {
      throw new Error('BTC amount must be a positive number');
    }

    const result = await this.pricesService.getSwapRateBtcToEthWithFee(btcAmount);
    return result;
  }

  @Post('alert')
  async setPriceAlert(
    @Body() alertData: { chain: string; price: number; email: string },
  ): Promise<string> {
    await this.pricesService.setPriceAlert(alertData.chain, alertData.price, alertData.email);
    return 'Alert set successfully!';
  }


}
