import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DiscordGuard } from './guards/discord.guard';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

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
  async discordCallback(@Res() res: Response) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    if (!frontendUrl) {
      throw new Error('FRONTEND_URL is not setted');
    }

    res.redirect(`${frontendUrl}`);
  }
}
