import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class economyUpdate1526172411086 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns('users', [
            new TableColumn({
                name: 'copper',
                type: 'integer',
                default: 0
            }),
            new TableColumn({
                name: 'last_daily',
                type: 'date',
                isNullable: true
            }),
            new TableColumn({
                name: 'streak',
                type: 'integer',
                default: 0
            })
        ])
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
