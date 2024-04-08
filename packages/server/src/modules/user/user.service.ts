import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOrCreate(data: CreateUserDto) {
    const user = await this.userRepository.findOneBy({
      email: data.email,
    });

    if (user) return user;

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
