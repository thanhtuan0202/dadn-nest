import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  userSignIn(@Body() { email: email, password: password }) {
    const res = this.authService.userSignin(email, password);
    return res;
  }
}
