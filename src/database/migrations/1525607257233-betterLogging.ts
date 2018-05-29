import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class betterLogging1525607257233 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns('guilds', [
            new TableColumn({
                name: 'joins_logging_channel',
                type: 'varchar',
                isNullable: true
            }),new TableColumn({
                name: 'leave_logging_channel',
                type: 'varchar',
                isNullable: true
            }),new TableColumn({
                name: 'mute_logging_channel',
                type: 'varchar',
                isNullable: true
            }),new TableColumn({
                name: 'invite_logging_channel',
                type: 'varchar',
                isNullable: true
            }),new TableColumn({
                name: 'ban_logging_channel',
                type: 'varchar',
                isNullable: true
            }),new TableColumn({
                name: 'unban_logging_channel',
                type: 'varchar',
                isNullable: true
            }),new TableColumn({
                name: 'suggestion_logging_channel',
                type: 'varchar',
                isNullable: true
            }),new TableColumn({
                name: 'ping_logging_channel',
                type: 'varchar',
                isNullable: true
            }),new TableColumn({
                name: 'spam_logging_channel',
                type: 'varchar',
                isNullable: true
            }),new TableColumn({
                name: 'command_logging_channel',
                type: 'varchar',
                isNullable: true
            }),new TableColumn({
                name: 'channel_management_logging_channel',
                type: 'varchar',
                isNullable: true
            })])
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
