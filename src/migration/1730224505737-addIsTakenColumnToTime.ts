import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIsTakenColumnToTime1730224505737 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "time" ADD "isTaken" boolean NOT NULL DEFAULT false`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "time" DROP COLUMN "isTaken"`)
  }
}
