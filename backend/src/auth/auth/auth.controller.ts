import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUser } from 'src/user/dto/create-user.dto';
import { LoginClient } from 'src/client/dto/create-client.dto';
import { LoginLessor } from 'src/lessor/dto/create-lessor.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-user')
  login(@Body() loginUser: LoginUser) {
    console.log('Controller - loginUser:', loginUser);
    return this.authService.userLogin(loginUser);
  }

  @Post('login-client')
  clientLogin(@Body() loginClient: LoginClient) {
    console.log('Controller - loginClient:', loginClient);
    return this.authService.clientLogin(loginClient);
  }

  @Post('login-lessor')
  lessorLogin(@Body() loginLessor: LoginLessor) {
    console.log('Controller - loginLessor:', loginLessor);
    return this.authService.lessorLogin(loginLessor);
  }

    // New endpoint to request a password reset code
    @Post('forget-password')
    forgetPassword(@Body() forgetDto: ForgetPasswordDto) {
      return this.authService.forgetPassword(forgetDto);
    }
  
    // New endpoint to reset the password
    @Post('reset-password')
    resetPassword(@Body() resetDto: ResetPasswordDto) {
      return this.authService.resetPassword(resetDto);
    }
}