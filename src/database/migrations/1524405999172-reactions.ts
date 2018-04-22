import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class reactions1524405999172 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('guilds', new TableColumn({
            name: 'reactions',
            type: 'boolean',
            default: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
