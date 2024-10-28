import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddMedicalNameColumnToMedicines1730125590497 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "medicine"
            ADD COLUMN medicalName VARCHAR(255) UNIQUE NULL;
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "medicine"
            DROP COLUMN medicalName;
        `)
  }
}
