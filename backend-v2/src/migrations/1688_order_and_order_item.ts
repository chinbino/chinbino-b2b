import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class OrderAndOrderItem1688 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "orders",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "buyerId", type: "int" },
                { name: "status", type: "varchar", default: "'pending'" },
                { name: "createdAt", type: "timestamp", default: "now()" },
                { name: "updatedAt", type: "timestamp", default: "now()" }
            ]
        }), true);

        await queryRunner.createTable(new Table({
            name: "order_items",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "orderId", type: "int" },
                { name: "productId", type: "int" },
                { name: "quantity", type: "int" },
                { name: "supplierId", type: "int", isNullable: true }
            ]
        }), true);

        await queryRunner.createForeignKey("order_items", new TableForeignKey({
            columnNames: ["orderId"],
            referencedColumnNames: ["id"],
            referencedTableName: "orders",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("order_items");
        await queryRunner.dropTable("orders");
    }
}
