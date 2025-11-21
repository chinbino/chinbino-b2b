import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register/seller')
  async registerSeller(@Body() sellerData: {
    email: string;
    phone: string;
    password: string;
    companyNameZh: string;
    companyNameFa: string;
    marketLocation: string;
    boothNumbers: string;
  }) {
    return this.authService.registerSeller(sellerData);
  }

  @Post('register/customer')
  async registerCustomer(@Body() customerData: {
    email: string;
    phone: string;
    password: string;
  }) {
    return this.authService.registerCustomer(customerData);
  }
}
