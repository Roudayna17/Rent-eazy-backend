import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginClient } from 'src/client/dto/create-client.dto';
import { ClientService } from 'src/client/client.service';
import { jwtConstants } from 'src/user/constants';
import { LoginUser } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginLessor } from 'src/lessor/dto/create-lessor.dto';
import { LessorService } from 'src/lessor/lessor.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { PasswordReset } from './entity/password-reset.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly clientService: ClientService,
    private readonly lessorService: LessorService, 
    @InjectRepository(PasswordReset)   
    private passwordResetRepository: Repository<PasswordReset>,

  ) {}

  // Valider un utilisateur
  async validateUser(loginUser: LoginUser) {
    const user = await this.userService.findByEmail(loginUser.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(loginUser.password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    return user;
  }

  // Valider un client
  async validateClient(loginClient: LoginClient) {
    const client = await this.clientService.findByEmail(loginClient.email);

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const isPasswordValid = await bcrypt.compare(loginClient.password, client.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    return client;
  }

  // Valider un lessor
  async validateLessor(loginLessor: LoginLessor) {
    const lessor = await this.lessorService.findByEmail(loginLessor.email);

    if (!lessor) {
      throw new NotFoundException('Lessor not found');
    }

    const isPasswordValid = await bcrypt.compare(loginLessor.password, lessor.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    return lessor;
  }

  // Login utilisateur
  async userLogin(loginUser: LoginUser) {
    const user = await this.validateUser(loginUser);

    const payload = {
      id: user.id,
      email: user.email,
      role: 'user', // Ajouter un rôle si nécessaire
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
        expiresIn: '1h', // Token expire après 1 heure
      }),
      user,
    };
  }

  // Login client
  async clientLogin(loginClient: LoginClient) {
    const client = await this.validateClient(loginClient);

    const payload = {
      id: client.id,
      email: client.email,
      role: 'client', // Ajouter un rôle si nécessaire
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
        expiresIn: '1h', // Token expire après 1 heure
      }),
      client,
    };
  }

  // Login lessor
  async lessorLogin(loginLessor: LoginLessor) {
    const lessor = await this.validateLessor(loginLessor);

    const payload = {
      id: lessor.id,
      email: lessor.email,
      role: 'lessor', // Ajouter un rôle si nécessaire
    };
 console.log(" lessor login", lessor)
    return {
      access_token: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
        expiresIn: '1h', // Token expire après 1 heure
      }),
      lessor,
    };
    
  }
  // Request a reset code: validate email exists, generate code, save it and log it.
  async forgetPassword(forgetDto: ForgetPasswordDto) {
    const { email, role } = forgetDto;
    let entity;

    switch (role) {
      case 'user':
        entity = await this.userService.findByEmail(email);
        break;
      case 'client':
        entity = await this.clientService.findByEmail(email);
        break;
      case 'lessor':
        entity = await this.lessorService.findByEmail(email);
        break;
      default:
        throw new BadRequestException('Invalid role');
    }

    if (!entity) {
      throw new NotFoundException('Email not found');
    }

    // Generate a 6-digit reset code as a string
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration time (e.g., 15 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Create a new PasswordReset record and save it to the database
    const passwordReset = this.passwordResetRepository.create({ email, role, code, expiresAt });
    await this.passwordResetRepository.save(passwordReset);

    // Log the reset code on the server console
    console.log(`Password reset code for [${role}] ${email}: ${code}`);

    return { message: 'Password reset code generated. Check server logs.' };
  }

  // Reset the password after verifying the reset code
  async resetPassword(resetDto: ResetPasswordDto) {
    const { email, role, code, newPassword } = resetDto;
    // Find the reset record that matches email, role, and code
    const resetRecord = await this.passwordResetRepository.findOne({
      where: { email, role, code },
    });

    // Check if the record exists and is not expired
    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    let result;
    switch (role) {
      case 'user':
        result = await this.userService.updatePassword(email, hashedPassword);
        break;
      case 'client':
        result = await this.clientService.updatePassword(email, hashedPassword);
        break;
      case 'lessor':
        result = await this.lessorService.updatePassword(email, hashedPassword);
        break;
      default:
        throw new BadRequestException('Invalid role');
    }
    
    // Delete the reset record after successful password update
    await this.passwordResetRepository.delete(resetRecord.id);
    
    return { message: 'Password successfully updated' };
  }
}