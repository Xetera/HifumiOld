import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class enabledGuildsFix1525205767838 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('users', 'enabled');

        await queryRunner.addColumn('guilds', new TableColumn({
            name: 'enabled',
            type: 'boolean',
            default: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
