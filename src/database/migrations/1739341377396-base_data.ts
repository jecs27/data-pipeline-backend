import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseData1739341377396 implements MigrationInterface {
    name = 'BaseData1739341377396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hotspot" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" character varying NOT NULL, "program" character varying NOT NULL, "installation_date" TIMESTAMP, "latitude" numeric NOT NULL, "longitude" numeric NOT NULL, "neighborhood" character varying, "borough" character varying, CONSTRAINT "PK_048ad2420ccd2992a6055f0f415" PRIMARY KEY ("uuid"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "hotspot"`);
    }

}
