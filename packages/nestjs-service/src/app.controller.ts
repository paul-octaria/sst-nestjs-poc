import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    console.log(appService)
  }

  @Get()
  getHello(): string {
    console.log('here')
    console.log(this.appService)
    return this.appService.getHello();
  }
}
