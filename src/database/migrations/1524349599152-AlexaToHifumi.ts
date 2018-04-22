import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class AlexaToHifumi1524349599152 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('watch_list');
        await queryRunner.dropTable('stats');
        await queryRunner.dropTable('guild');
        await queryRunner.dropTable('whitelisted_invites');
        await queryRunner.addColumns('guilds', [
            new TableColumn({
                name: 'cleverbot_calls',
                type: 'integer',
                default: 0
        }), new TableColumn({
                name: 'premium',
                type: 'boolean',
                default: false
        }), new TableColumn({
                name: 'visible',
                type: 'boolean',
                default: false
        }), new TableColumn({
                name: 'users_banned',
                type: 'integer',
                default: 0
        }), new TableColumn({
                name: 'users_muted',
                type: 'integer',
                default: 0
        }),new TableColumn({
                name: 'spam_deleted',
                type: 'integer',
                default: 0
        }),new TableColumn({
                name: 'lockdowns',
                type: 'integer',
                default: 0
        }), new TableColumn({
                name: 'chat_channel',
                type: 'varchar',
                isNullable: true
        })]);
        await queryRunner.renameColumn('guilds', 'command_hints', 'hints');
        await queryRunner.changeColumn('guilds', 'lockdown',
            new TableColumn({
                name: 'lockdown',
                type: 'boolean',
                isNullable: true,
                default: false
            })
        );

        await queryRunner.createForeignKey('users',
            new TableForeignKey({
                referencedTableName: 'guilds',
                columnNames: ['guild_id'],
                referencedColumnNames: ['id']
            })
        );

        await queryRunner.createForeignKey('macros',
            new TableForeignKey({
                referencedTableName: 'guilds',
                columnNames: ['guild_id'],
                referencedColumnNames: ['id']
        }));

        await queryRunner.createForeignKey('notes',
            new TableForeignKey({
                referencedTableName: 'guilds',
                referencedColumnNames: ['id'],
                columnNames: ['guild_id']
            }));
        await queryRunner.addColumn('macros',
            new TableColumn({
                name: 'guild_name',
                type: 'varchar',
                isNullable: true
            }));

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
