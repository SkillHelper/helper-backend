import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async generateRefreshToken({
    uuid,
  }: Pick<User, 'uuid'>): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(
      { uuid },
      {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
      },
    );

    await this.userRepository.update({ uuid }, { refreshToken });

    return refreshToken;
  }

  public async removeRefreshToken({ uuid }: Pick<User, 'uuid'>): Promise<void> {
    await this.userRepository.update({ uuid }, { refreshToken: null });
  }

  public async validateRefreshToken(
    { uuid }: Pick<User, 'uuid'>,
    refreshToken: string,
  ): Promise<false | User> {
    const user = await this.userRepository.findOne({
      where: {
        uuid,
      },
    });
    const token = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
    });

    if (!user || !token) return false;

    return (
      token.uuid === user.uuid && refreshToken === user.refreshToken && user
    );
  }

  public async generateAccessToken({
    uuid,
  }: Pick<User, 'uuid'>): Promise<string> {
    const accessToken = await this.jwtService.signAsync(
      { uuid },
      {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
      },
    );

    return accessToken;
  }
}
