import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  async userSignIn(@Body() { email: email, password: password }, @Res() res) {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCreadentaials) => {
          const user = userCreadentaials.user;
          this.authService.getById(user.uid).then((data) => {
            res.status(200).send({
              ...JSON.parse(data),
              accessToken: user['accessToken'],
              message: 'successful',
            });
          });
        })
        .catch((error) => {
          throw error;
        });
    } catch (err) {
      throw new HttpException(
        {
          status: 401,
          error: err.message,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: err,
        },
      );
    }
  }
  @Get('logout')
  async Signout(@Res() res) {
    const auth = getAuth();
    await signOut(auth)
      .then(() => {
        res.status(200).send({
          message: 'Log out successfully',
        });
      })
      .catch((error) => {
        res.status(401).send({
          message: error.message,
        });
      });
  }
}
