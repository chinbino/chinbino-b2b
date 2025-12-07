import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class CreateOrderAndOrderItem1750000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // ساخت جدول orders
        await queryRunner.createTable(
            new Table({
                name: "orders",
                columns: [
                    { name: "id", type: "bigserial", isPrimary: true },
                    { name: "buyerId", type: "bigint", isNullable: false },
                    { name: "status", type: "varchar", length: "50", default: "'pending'" },
                    { name: "createdAt", type: "timestamp", default: "now()" },
                    { name: "updatedAt", type: "timestamp", default: "now()" }
                ]
            }),
            true
        );

        // ساخت جدول order_items
        await queryRunner.createTable(
            new Table({
                name: "order_items",
                columns: [
                    { name: "id", type: "bigserial", isPrimary: true },
                    { name: "orderId", type: "bigint", isNullable: false },
                    { name: "productId", type: "bigint", isNullable: false },
                    { name: "quantity", type: "int", default: 1 },
                    { name: "price", type: "numeric", default: 0 },
                    { name: "createdAt", type: "timestamp", default: "now()" },
                    { name: "updatedAt", type: "timestamp", default: "now()" }
                ]
            }),
            true
        );

        // اضافه کردن ستون supplierId به order_items (اگر وجود ندارد)
        const table = await queryRunner.getTable("order_items");
        if (!table!.columns.find(c => c.name === "supplierId")) {
            await queryRunner.addColumn(
                "order_items",
                new TableColumn({
                    name: "supplierId",
                    type: "bigint",
                    isNullable: false
                })
            );
        }

        // Foreign Key: order_items → orders
        const fkOrder = new TableForeignKey({
            columnNames: ["orderId"],
            referencedColumnNames: ["id"],
            referencedTableName: "orders",
            onDelete: "CASCADE",
            name: "FK_order_items_orders"
        });

        // Foreign Key: order_items → suppliers
        const fkSupplier = new TableForeignKey({
            columnNames: ["supplierId"],
            referencedColumnNames: ["id"],
            referencedTableName: "suppliers",
            onDelete: "CASCADE",
            name: "FK_order_items_suppliers"
        });

        // اضافه کردن Foreign Key ها اگر وجود ندارند
        if (!table!.foreignKeys.find(fk => fk.name === "FK_order_items_orders")) {
            await queryRunner.createForeignKey("order_items", fkOrder);
        }
        if (!table!.foreignKeys.find(fk => fk.name === "FK_order_items_suppliers")) {
            await queryRunner.createForeignKey("order_items", fkSupplier);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("order_items", true);
        await queryRunner.dropTable("orders", true);
    }
}
