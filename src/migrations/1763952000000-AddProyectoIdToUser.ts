import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddProyectoIdToUser1763952000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', new TableColumn({
            name: 'proyecto_id',
            type: 'uuid',
            isNullable: true,
        }));

        await queryRunner.createForeignKey('users', new TableForeignKey({
            columnNames: ['proyecto_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'proyectos',
            onDelete: 'SET NULL',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('users');
        if (table) {
            const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('proyecto_id') !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey('users', foreignKey);
            }
            await queryRunner.dropColumn('users', 'proyecto_id');
        }
    }

}
