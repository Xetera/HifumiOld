import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class suggestions1525245572331 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'suggestions',
            columns: [new TableColumn({
                name: 'suggestion_id',
                type: 'integer',
                isPrimary: true,
                isGenerated: true
            }),new TableColumn({
                name: 'message_id',
                type: 'varchar',
                isNullable: true
            }),new TableColumn({
                name: 'channel_id',
                type: 'varchar',
                isNullable: true
            }),new TableColumn({
                name: 'suggestion_message',
                type: 'varchar'
            }),new TableColumn({
                name: 'guild_id',
                type: 'varchar'
            }),new TableColumn({
                name: 'guild_name',
                type: 'varchar',
            }),new TableColumn({
                name: 'user_id',
                type: 'varchar',
            }),new TableColumn({
                name: 'user_name',
                type: 'varchar'
            }),new TableColumn({
                name: 'suggestion_status',
                type: 'enum',
                enum: [
                    'PENDING',
                    'DENIED',
                    'ACCEPTED',
                    'REJECTED',
                    'AWAITING_APPROVAL'
                ],
                default: 'AWAITING_APPROVAL'
            }),new TableColumn({
                name: 'suggestion_date',
                type: 'date',
            }),new TableColumn({
                name: 'status_reason',
                type: 'varchar',
                isNullable: true
            }),new TableColumn({
                name: 'response_date',
                type: 'varchar',
                isNullable: true
            }),new TableColumn({
                name: 'upvotes',
                type: 'number',
                isNullable: true,
                default: 0
            }),new TableColumn({
                name: 'downvotes',
                type: 'number',
                isNullable: true,
                default: 0
            })]
        }));

        await queryRunner.addColumns('guilds', [new TableColumn({
            name: 'suggestions_channel',
            type: 'varchar',
            isNullable: true
        }), new TableColumn({
            name: 'invite_warn_threshold',
            type: 'integer',
            default: 4
        }), new TableColumn({
            name: 'invite_ban_threshold',
            type: 'integer',
            default: 5
        })]);

        await queryRunner.createForeignKey('suggestions', new TableForeignKey({
            referencedTableName: 'guilds',
            referencedColumnNames: ['id'],
            columnNames: ['guild_id']
        }));

        await queryRunner.addColumns('users', [new TableColumn({
            name: 'commands_used',
            type: 'integer',
            default: 0
        }), new TableColumn({
            name: 'macros_used',
            type: 'integer',
            default: 0
        })])
    }

    public async down(queryRunner: QueryRunner): Promise<any> {}
}
