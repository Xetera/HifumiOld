import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class guildMuteRole1525205992457 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('guilds', new TableColumn({
            name: 'mute_role',
            type: 'varchar',
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {

    }

}
