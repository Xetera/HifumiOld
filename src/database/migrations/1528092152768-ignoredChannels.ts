import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class ignoredChannels1528092152768 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'ignored_channels',
            columns: [
                new TableColumn({
                    name: 'channel_id',
                    isPrimary: true,
                    type: 'varchar'
                }),
                new TableColumn({
                    name: 'guild_id',
                    isPrimary: true,
                    type: 'varchar'
                }),
                new TableColumn({
                    name: 'ignore_date',
                    type: 'date'
                }),
                new TableColumn({
                    name: 'ignored_by',
                    type: 'varchar'
                })
            ]
        }));
        await queryRunner.createForeignKey('ignored_channels', new TableForeignKey({
            columnNames: ['guild_id'],
            referencedTableName: 'guilds',
            referencedColumnNames: ['id']
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('ignored_channels');
    }

}
