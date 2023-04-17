import { Injectable } from '@nestjs/common';

export function getHi(){
  console.log('hi')
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
