import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  private readonly guildId: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get('DISCORD_CLIENT_ID'),
      clientSecret: configService.get('DISCORD_CLIENT_SECRET'),
      callbackURL: configService.get('DISCORD_CALLBACK_URL'),
      scope: ['identify', 'email', 'guilds'],
    });

    this.guildId = configService.get('DISCORD_GUILD_ID');
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    cb: any,
  ) {
    if (!profile.guilds.some((guild) => guild.id === this.guildId))
      return cb(new Error('You are not in the guild'));

    const user = await this.userService.findOrCreate({
      email: profile.email,
      username: profile.username,
      profileImage: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.webp?size=128`,
    });

    cb(null, user);
  }
}
