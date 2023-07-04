import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TShockService } from './tshock.service';
import { ResponseMessage } from './types';
import { User } from './api/tshock/types';

interface UserCreateModel {
  user: string;
  password: string;
  group: string | null;
}

@Controller('user')
export default class UserController {
  constructor(private readonly tsSvc: TShockService) {}

  @Get()
  async list(): Promise<ResponseMessage<User[]>> {
    const users = await this.tsSvc.getUsers();
    return {
      code: 0,
      message: '成功',
      data: users,
    };
  }

  @Get('active')
  async active(): Promise<ResponseMessage<string[]>> {
    return {
      code: 1,
      message: '暂未实现',
      data: [],
    };
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<ResponseMessage<User>> {
    const user = await this.tsSvc.getUser(id);
    return {
      code: 0,
      message: '成功',
      data: user,
    };
  }

  @Post()
  async create(@Body() model: UserCreateModel) {
    console.info(`正在创建用户：`, model);
    const succ = await this.tsSvc.createUser(
      model.user,
      model.password,
      model.group,
    );
    return {
      code: succ ? 0 : 1,
      message: succ ? '成功' : '失败',
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() model: UserCreateModel) {
    console.info(`正在更新用户${id}`);
    return {
      code: 1,
      message: '暂未实现',
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    console.info(`正在删除用户${id}`);
    return {
      code: 1,
      message: '暂未实现',
    };
  }
}
