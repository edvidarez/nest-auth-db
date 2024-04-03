import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @ApiProperty({
    example: 'user123',
    description: 'The username of the user',
    required: true,
  })
  username: string;

  @Column()
  @IsNotEmpty()
  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
    required: true,
  })
  password: string;

  @BeforeInsert()
  async hashPassword?(): Promise<void> {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
