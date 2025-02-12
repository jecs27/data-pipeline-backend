import { Entity, Column } from 'typeorm';
import { ObjectType, Field, Float, ID } from '@nestjs/graphql';
import BaseEntity from '../../utils/baseEntity';

@ObjectType()
@Entity('hotspot')
export default class Hotspot extends BaseEntity {
  @Field(() => ID)
  @Column({ type: 'varchar', nullable: false })
  id: string;

  @Field()
  @Column({ type: 'varchar', nullable: false })
  program: string;

  @Field({ nullable: true })
  @Column({
    type: 'timestamp without time zone',
    name: 'installation_date',
    nullable: true,
  })
  installationDate: string;

  @Field(() => Float)
  @Column({ type: 'decimal', nullable: false })
  latitude: number;

  @Field(() => Float)
  @Column({ type: 'decimal', nullable: false })
  longitude: number;

  @Field({ nullable: true })
  @Column({ type: 'varchar', name: 'neighborhood', nullable: true })
  neighborhood: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', name: 'borough', nullable: true })
  borough: string;
}
