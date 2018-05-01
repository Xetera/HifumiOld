import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class persistentMutes1525024992361 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'muted_users',
            columns: [new TableColumn({
                name: 'mute_id',
                type: 'integer',
                isPrimary: true,
                isGenerated: true
            }), new TableColumn({
                name: 'user_id',
                type: 'varchar'
            }), new TableColumn({
                name: 'guild_id',
                type: 'varchar'
            }), new TableColumn({
                name: 'start_date',
                type: 'date'
            }), new TableColumn({
                name: 'end_date',
                type: 'date'
            })]
        }));
        await queryRunner.createForeignKey('muted_users', new TableForeignKey({
            columnNames: ['guild_id'],
            referencedTableName: 'guilds',
            referencedColumnNames: ['id']
        }));
        await queryRunner.addColumn('users', new TableColumn({
            name: 'history_calls',
            type: 'integer',
            default: 0
        }));
        await queryRunner.addColumn('users', new TableColumn({
            name: 'enabled',
            type: 'boolean',
            default: true
        }));
        await queryRunner.changeColumn('guilds', 'allows_invites', new TableColumn({
            name: 'allows_invites',
            type: 'boolean',
            default: true
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('muted_users');
    }

}
