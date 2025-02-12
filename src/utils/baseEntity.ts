import { Field, ObjectType } from '@nestjs/graphql';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@ObjectType()
export default abstract class BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  uuid?: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp without time zone', name: 'created_at' })
  createdAt?: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp without time zone', name: 'updated_at' })
  updatedAt?: Date;

  @Field()
  @DeleteDateColumn({ type: 'timestamp without time zone', name: 'deleted_at' })
  deletedAt?: Date;
}
