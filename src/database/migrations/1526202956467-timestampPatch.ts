import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class timestampPatch1526202956467 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.changeColumn('users', 'last_daily', new TableColumn({
            name: 'last_daily',
            type: 'timestamp',
            isNullable: true
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
