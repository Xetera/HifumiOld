import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class invitePatch1525603037519 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.changeColumn('guilds', 'hints', new TableColumn({
            name: 'hints',
            type: 'boolean',
            default: false
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
