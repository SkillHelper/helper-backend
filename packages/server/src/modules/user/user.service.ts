import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { Client } from 'discord.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectDiscordClient()
    public readonly discordClient: Client,
    private readonly configService: ConfigService,
  ) {
    const guildId = this.configService.get('DISCORD_GUILD_ID');
    discordClient
      .login(this.configService.get('DISCORD_BOT_TOKEN'))
      .then(() => {
        discordClient.guilds.fetch(guildId).then((guild) => {
          discordClient.guilds.cache
            .get(guild.id)
            .members.fetch()
            .then((members) => {
              members
                .filter((member) => !member.user.bot)
                .map(async (member) => {
                  await this.findOrCreate({
                    username: member.user.username,
                    profileImage: member.user.displayAvatarURL(),
                    displayName: member.displayName,
                    clientId: member.user.id,
                  });
                });
            });
        });
      });
  }

  async findAll() {
    const users = await this.userRepository.find();

    return users;
  }

  async findOneByUUID(uuid: string) {
    const user = await this.userRepository.findOneBy({ uuid });
    if (!user)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);

    return user;
  }

  async findOrCreate(data: CreateUserDto) {
    const user = await this.userRepository.findOneBy({
      username: data.username,
    });

    if (user) {
      await this.userRepository.update({ uuid: user.uuid }, data);
      return user;
    }

    const newUser = this.userRepository.create(data);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async create(data: CreateUserDto) {
    const existUser = await this.userRepository.findOneBy({
      email: data.email,
    });
    if (existUser)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }
}
