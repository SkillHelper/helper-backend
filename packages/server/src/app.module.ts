import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { DatabaseModule } from './providers/database.module';
import { ConfigValidator } from './validators/config.validator';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { NoticeModule } from './modules/notice/notice.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DiscordModule } from '@discord-nestjs/core';
import { GatewayIntentBits } from 'discord.js';
import { ExplanationModule } from './modules/explanation/explanation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
      validationSchema: ConfigValidator,
    }),
    ScheduleModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService) => ({
        ttl: configService.get('CACHE_TTL'),
        max: configService.get('CACHE_MAX'),
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    NoticeModule,
    ExplanationModule,
    DiscordModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('DISCORD_BOT_TOKEN'),
        discordClientOptions: {
          intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
          ],
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
