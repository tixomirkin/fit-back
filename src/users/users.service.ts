import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as schema from "../drizzle/schema";
import {eq} from "drizzle-orm";
import {usersTable} from "../drizzle/schema";
import {genSalt, hash} from "bcrypt";
import {DrizzleAsyncProvider} from "../drizzle/drizzle.provider";
import {NodePgDatabase} from "drizzle-orm/node-postgres";

@Injectable()
export class UsersService {
  constructor( @Inject(DrizzleAsyncProvider)
               private db: NodePgDatabase<typeof schema> ) {
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt();
    return await hash(password, salt);
  }

  async createUser(email: string, password: string){

    const [userByEmail] = await this.db.select().from(usersTable).where(eq(usersTable.email, email));

    if (userByEmail) {
      throw new HttpException('this email is already in use', HttpStatus.CONFLICT);
    }

    const [userWithPass] = await this.db.insert(usersTable).values({
      email: email,
      passwordHash: await this.hashPassword(password),
    }).returning();

    const {passwordHash, ...user} = userWithPass;
    return user
  }

  async getById(id: string): Promise<any> {
    const [userById] = await this.db.select().from(schema.usersTable).where(eq(usersTable.id, id));
    if (!userById) {
      throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
    }
    return userById;
  }

  async getByEmail(email: string) {
    const [userByEmail] = await this.db.select().from(schema.usersTable).where(eq(usersTable.email, email));
    if (!userByEmail) {
      throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    }
    return userByEmail;
  }

  async getByIdWithoutPass(id: string | typeof usersTable.id) {
    const [userWithPass] = await this.db.select().from(schema.usersTable).where(eq(usersTable.id, id));
    const {passwordHash, ...user} = userWithPass;
    return user
  }


  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
