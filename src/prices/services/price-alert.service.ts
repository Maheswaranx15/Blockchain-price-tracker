import { Injectable, Logger } from '@nestjs/common';
import { PricesService } from '../prices.service';
import * as nodemailer from 'nodemailer';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PriceAlertService {
  private previousPrices = {
    ethereum: 0,
    'matic-network': 0,
  };
  private logger = new Logger(PriceAlertService.name);

  constructor(private readonly pricesService: PricesService) {}

  // Cron job to check price every hour
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    await this.checkAndAlertPrice('ethereum');
    await this.checkAndAlertPrice('polygon');
  }

  // Function to check and send email if price increases by 3%
  async checkAndAlertPrice(chain: string) {
    const currentPrice = await this.pricesService.getPrice(chain);
    const previousPrice = this.previousPrices[chain];

    if (previousPrice === 0) {
      this.previousPrices[chain] = currentPrice;
      return; // Skip for the first comparison
    }

    const priceChangePercentage = ((currentPrice - previousPrice) / previousPrice) * 100;

    if (priceChangePercentage > 3) {
      await this.sendEmail(chain, currentPrice, priceChangePercentage);
    }

    // Update the previous price for next comparison
    this.previousPrices[chain] = currentPrice;
  }

  // Function to send email
  private async sendEmail(chain: string, currentPrice: number, priceChangePercentage: number) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,  // Use environment variable
        pass: process.env.EMAIL_PASS,  // Use environment variable
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,  // Use environment variable
      to: 'maheshwaran@chainscript.dev',
      subject: `Price Alert: ${chain} Price Increased`,
      text: `The price of ${chain} has increased by ${priceChangePercentage.toFixed(2)}%. Current price: $${currentPrice}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      this.logger.log(`Email sent for ${chain} price increase.`);
    } catch (error) {
      this.logger.error('Error sending email:', error);
    }
  }

  
}
