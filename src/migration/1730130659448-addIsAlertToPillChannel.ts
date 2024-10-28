import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIsAlertToPillChannel1730130659448 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pill_channel"
            ADD COLUMN "isAlert" Boolean;
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pill_channel"
            DROP COLUMN "isAlert";
        `)
  }
}
