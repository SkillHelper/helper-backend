import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Explanation } from './entities/explanation.entity';
import { Repository } from 'typeorm';
import { CreateExplanationDto } from './dto/create-explanation.dto';
import { UpdateExplanationDto } from './dto/update-explanation.dto';

@Injectable()
export class ExplanationService {
  constructor(
    @InjectRepository(Explanation)
    private readonly explanationRepository: Repository<Explanation>,
  ) {}

  async findAll(): Promise<Explanation[]> {
    return await this.explanationRepository.find();
  }

  async findOneByUUID(uuid: string): Promise<Explanation> {
    const explanation = await this.explanationRepository.findOneBy({ uuid });

    if (!explanation)
      throw new HttpException('Explanation not found', HttpStatus.BAD_REQUEST);

    return explanation;
  }

  async create(body: CreateExplanationDto) {
    const explanation = this.explanationRepository.create(body);

    return await this.explanationRepository.save(explanation);
  }

  async update(uuid: string, body: UpdateExplanationDto) {
    const explanation = await this.explanationRepository.findOneBy({ uuid });

    if (!explanation)
      throw new HttpException('Explanation not found', HttpStatus.BAD_REQUEST);

    Object.assign(explanation, body);

    return await this.explanationRepository.save(explanation);
  }

  async delete(uuid: string) {
    const explanation = await this.explanationRepository.findOneBy({ uuid });

    if (!explanation)
      throw new HttpException('Explanation not found', HttpStatus.BAD_REQUEST);

    return await this.explanationRepository.remove(explanation);
  }
}
