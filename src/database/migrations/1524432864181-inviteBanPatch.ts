import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";
import {User} from "../models/user";

export class inviteBanPatch1524432864181 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('guilds', new TableColumn({
            name: 'tracking_new_members',
            type: 'boolean',
            default: false
        }));

        await queryRunner.addColumn('guilds', new TableColumn({
            name: 'infraction_limit',
            type: 'integer',
            default: 3,
            isNullable: false
        }));

        await queryRunner.addColumn('guilds', new TableColumn({
            name: 'welcome_message',
            type: 'varchar',
            isNullable: true
        }));

        await queryRunner.createTable(new Table({
            name: 'infractions',
            columns: [
                new TableColumn({
                    name: 'infraction_id',
                    isGenerated: true,
                    isPrimary: true,
                    type: 'integer'
                }), new TableColumn({
                    name: 'target_id',
                    type: 'varchar',
                }), new TableColumn({
                    name: 'guild_id',
                    type: 'varchar'
                }), new TableColumn({
                    name: 'guild_name',
                    type: 'varchar',
                    isNullable: true
                }), new TableColumn({
                    name: 'staff_id',
                    type: 'varchar'
                }), new TableColumn({
                    name: 'staff_name',
                    type: 'varchar',
                    isNullable: true // really just optional
                }), new TableColumn({
                    name: 'infraction_reason',
                    type: 'varchar'
                }), new TableColumn({
                    name: 'infraction_weight',
                    type: 'integer',
                    default: 0
                }), new TableColumn({
                    name: 'infraction_date',
                    type: 'date'
                }), new TableColumn({
                    name: 'expiration_date',
                    type: 'date'
                })]
        }));

        await queryRunner.createForeignKey('infractions', new TableForeignKey({
            referencedColumnNames: ['id'],
            columnNames: ['guild_id'],
            referencedTableName: 'guilds'
        }));

        await queryRunner.addColumn('users', new TableColumn({
            name: 'strike_count',
            type: 'integer',
            default: 0,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('guilds', new TableColumn({name: 'tracking_new_members', type: 'boolean'}))
        await queryRunner.dropTable('infractions');
    }

}
