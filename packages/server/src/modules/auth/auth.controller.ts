import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { DiscordGuard } from './guards/discord.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { REFRESH_TOKEN_KEY, REFRESH_TOKEN_OPTION } from 'reference/lib/cookie';
import { CurrentUser } from 'src/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { RefreshGuard } from './guards/refresh.guard';
import { RefreshResDto } from './dto/refresh.dto';
import { AccessGuard } from './guards/access.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('discord')
  @UseGuards(DiscordGuard)
  discord() {}

  @Get('discord/callback')
  @UseGuards(DiscordGuard)
  async discordCallback(@CurrentUser() user: User, @Res() res: Response) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    if (!frontendUrl) {
      throw new Error('FRONTEND_URL is not setted');
    }

    const refreshToken = await this.authService.generateRefreshToken(user);

    res.cookie(REFRESH_TOKEN_KEY, refreshToken, REFRESH_TOKEN_OPTION());
    res.redirect(`${frontendUrl}`);
  }

  @Get('refresh')
  @UseGuards(RefreshGuard)
  async refresh(@CurrentUser() user: User): Promise<RefreshResDto> {
    const accessToken = await this.authService.generateAccessToken(user);

    return {
      accessToken,
    };
  }

  @Get('logout')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async logout(
    @Req() req: Request,
    @CurrentUser() user: User,
    @Res() res: Response,
  ): Promise<void> {
    const refreshToken = req.cookies[REFRESH_TOKEN_KEY];
    if (!refreshToken)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    await this.authService.removeRefreshToken(user);

    res.clearCookie(REFRESH_TOKEN_KEY);
    res.status(200).send('ok');
  }
}
