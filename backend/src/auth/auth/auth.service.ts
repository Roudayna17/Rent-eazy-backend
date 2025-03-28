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

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly clientService: ClientService,
    private readonly lessorService: LessorService, // Injection de LessorService
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

    return {
      access_token: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
        expiresIn: '1h', // Token expire après 1 heure
      }),
      lessor,
    };
  }
}