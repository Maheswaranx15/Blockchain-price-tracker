import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // This defines the route for GET /
  getHello(): string {
    return this.appService.getHello();
  }
}
