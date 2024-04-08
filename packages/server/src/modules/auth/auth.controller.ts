import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DiscordGuard } from './guards/discord.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('discord')
  @UseGuards(DiscordGuard)
  discord() {}

  @Get('discord/callback')
  @UseGuards(DiscordGuard)
  async discordCallback() {}
}
