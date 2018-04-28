import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class usersPatch1524911593961 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                new TableColumn({
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true,
                    isNullable: false
                }), new TableColumn({
                    name: 'guild_id',
                    type: 'varchar',
                    isPrimary: true,
                    isNullable: false
                }),new TableColumn({
                    name: 'invite_strikes',
                    type: 'integer',
                    default: 0
                }),new TableColumn({
                    name: 'strike_count',
                    type: 'integer',
                    default: 0
                }),new TableColumn({
                    name: 'ignoring',
                    type: 'boolean',
                    default: false
                })
            ],
            foreignKeys: [new TableForeignKey({
                referencedTableName: 'guilds',
                referencedColumnNames: ['id'],
                columnNames: ['guild_id']
            })]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {

    }

}
