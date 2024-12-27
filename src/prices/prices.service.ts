// import { Injectable } from '@nestjs/common';
// import axios from 'axios';
// import { Price } from './entities/price.entity';
// import { MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import { PriceRepository } from './price.repository';

// @Injectable()
// export class PricesService {
//   constructor(
//     @InjectRepository(PriceRepository)
//     private readonly priceRepository: PriceRepository,
//   ) {}

//   getPricesForLast24Hours(chain: string) {
//     throw new Error('Method not implemented.');
//   }

//   async getPrice(chain: string): Promise<number> {
//     const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${chain}&vs_currencies=usd`;
//     const response = await axios.get(apiUrl);
//     return response.data[chain]?.usd ?? 0;
//   }

//   async getPriceHistory(chain: string) {
//     const currentDate = new Date();
//     const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

//     // Query the database for the price history grouped by hour
//     const prices = await this.priceRepository.createQueryBuilder('price')
//       .select('DATE_TRUNC(\'hour\', price.timestamp)', 'hour')
//       .addSelect('AVG(price.value)', 'averagePrice') // Get average price per hour
//       .where('price.chain = :chain', { chain })
//       .andWhere('price.timestamp >= :past24Hours', { past24Hours })
//       .groupBy('hour')
//       .orderBy('hour', 'ASC')
//       .getRawMany();

//     // Format the result into an array of objects with hour and price
//     const priceHistory = prices.map(item => ({
//       hour: item.hour,
//       price: item.averagePrice,
//     }));

//     return priceHistory;
//   }
// }
import { Injectable } from '@nestjs/common';
import { PriceRepository } from './repository/price.repository';
import { AlertRepository } from './repository/alert.repository';
import axios from 'axios';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PricesService {
  constructor(private readonly priceRepository: PriceRepository,
    private readonly alertRepository: AlertRepository, // Inject AlertRepository
    ) {}

  async getPriceHistory(chain: string) {
    const priceHistory = await this.priceRepository.getPriceHistoryGroupedByHour(chain);
    return priceHistory;
  }

  @Cron('0 */5 * * * *') 
async fetchAndStorePrice() {
  const chains = ['ethereum', 'matic-network','bitcoin-cash','bitcoin']; 

  try {
    // Fetch prices from an external API (example using Axios)
    const pricePromises = chains.map(chain =>
      axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${chain}&vs_currencies=usd`)
    );

    // Wait for all price fetches to complete
    const priceResponses = await Promise.all(pricePromises);

    // Process each chain's price data and store it
    for (let i = 0; i < chains.length; i++) {
      const chain = chains[i];
      const price = priceResponses[i].data[chain].usd;

      // Store price in the database
      await this.priceRepository.save({
        chain,
        price,
        timestamp: new Date(),
      });

      console.log(`Price for ${chain}: $${price} saved at ${new Date()}`);
    }
  } catch (error) {
    console.error('Error fetching prices:', error);
  }
  }

  async getPrice(chain: string): Promise<number> {
    const latestPrice = await this.priceRepository.getLatestPrice(chain);
    return latestPrice;
  }
  

  async setPriceAlert(chain: string, price: number, email: string) {
    console.log(`Setting alert for chain: ${chain}, price: $${price}, email: ${email}`);
    await this.alertRepository.save({ chain, price, email });
  }

  async getSwapRateWithFee(ethAmount: number): Promise<any> {
    const feePercentage = 0.03; // 3% fee

    try {
      // Fetch prices for Ethereum and Bitcoin from CoinGecko
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd');
      const ethToUsd = response.data.ethereum.usd;
      const btcToUsd = response.data.bitcoin.usd;

      // Calculate swap rate (ETH to BTC) using the prices in USD
      const swapRate = ethToUsd / btcToUsd;

      // Calculate how much BTC you can get for the given ETH amount
      const btcAmount = ethAmount * swapRate;

      // Calculate the fee in ETH and USD
      const feeEth = ethAmount * feePercentage;
      const feeUsd = feeEth * ethToUsd;

      return {
        btcAmount,
        feeEth,
        feeUsd,
        ethToUsd,  // ETH to USD rate for conversion reference
        btcToUsd,  // BTC to USD rate for conversion reference
      };
    } catch (error) {
      console.error('Error fetching swap rate with fee:', error);
      throw new Error('Unable to fetch swap rate with fee');
    }
  }

  async getSwapRateBtcToEthWithFee(btcAmount: number): Promise<any> {
    const feePercentage = 0.03; // 3% fee

    try {
      // Fetch prices for Bitcoin and Ethereum from CoinGecko
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd');
      const ethToUsd = response.data.ethereum.usd;
      const btcToUsd = response.data.bitcoin.usd;

      // Calculate swap rate (BTC to ETH) using the prices in USD
      const swapRate = btcToUsd / ethToUsd;

      // Calculate how much ETH you can get for the given BTC amount
      const ethAmount = btcAmount * swapRate;

      // Calculate the fee in BTC and ETH
      const feeBtc = btcAmount * feePercentage;
      const feeEth = feeBtc * swapRate;
      const feeUsd = feeBtc * btcToUsd;

      return {
        ethAmount,
        feeBtc,
        feeEth,
        feeUsd,
        ethToUsd,  // ETH to USD rate for conversion reference
        btcToUsd,  // BTC to USD rate for conversion reference
      };
    } catch (error) {
      console.error('Error fetching swap rate with fee:', error);
      throw new Error('Unable to fetch swap rate with fee');
    }
  }
}
