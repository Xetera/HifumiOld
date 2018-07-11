import {MigrationInterface, QueryRunner, Table, TableColumn} from "typeorm";
import {Macro} from "../models/macro";
import {parseMacro} from "../../parsers/parseMacro";

export class macroChanges1528405954220 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.changeColumn('macros', new TableColumn({
            name: 'macro_content',
            type: 'varchar'
        }), new TableColumn({
            name: 'macro_content',
            isNullable: true,
            type: 'varchar'
        }));
        await queryRunner.addColumn('macros', new TableColumn({
            name: 'macro_links',
            isArray: true,
            type: 'varchar',
            isNullable: true
        }));

        // updating old macro content
        const macros = <Macro[]> await queryRunner.query('SELECT macro_name, guild_id, macro_content, macro_links FROM macros');
        for (let macro of macros){
            const [content, links] = await parseMacro(macro.macro_content);
            queryRunner.query(
                `UPDATE macros SET macro_content = $1, macro_links = $2 WHERE guild_id = $3 AND macro_name = $4`,
                [content, links, macro.guild_id, macro.macro_name]
            );
        }
    }


    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('macros', 'macro_links');
        await queryRunner.changeColumn('macros', new TableColumn({
            name: 'macro_content',
            isNullable: true,
            type: 'varchar'
        }), new TableColumn({
            name: 'macro_content',
            type: 'varchar'
        }));
    }

}
