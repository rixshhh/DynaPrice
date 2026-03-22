import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  private readonly users = [new UserEntity('usr_1', 'owner@dynaprice.app', 'DynaPrice Owner')];

  async findAll(): Promise<UserEntity[]> {
    return this.users;
  }
}
