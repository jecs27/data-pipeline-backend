import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export default abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid?: string;

  @CreateDateColumn({ type: 'timestamp without time zone', name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone', name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ type: 'timestamp without time zone', name: 'deleted_at' })
  deletedAt?: Date;
}
