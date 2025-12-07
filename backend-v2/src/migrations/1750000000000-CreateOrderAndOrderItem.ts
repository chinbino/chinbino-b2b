import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class CreateOrderAndOrderItem1750000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("order_items");
        if (table && table.findColumnByName("supplierId")) {
            await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "supplierId"`);
        }

        // اضافه کردن ستون uuid مطابق suppliers.id
        await queryRunner.query(`ALTER TABLE "order_items" ADD "supplierId" uuid`);

        // مقداردهی به رکوردهای موجود با یک supplier معتبر
        await queryRunner.query(`
            UPDATE "order_items"
            SET "supplierId" = (SELECT id FROM suppliers LIMIT 1)
            WHERE "supplierId" IS NULL
        `);

        // تبدیل ستون به NOT NULL بعد از مقداردهی
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "supplierId" SET NOT NULL`);

        // ایجاد Foreign Key
        await queryRunner.createForeignKey(
            "order_items",
            new TableForeignKey({
                columnNames: ["supplierId"],
                referencedColumnNames: ["id"],
                referencedTableName: "suppliers",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("order_items");
        const foreignKey = table!.foreignKeys.find(fk => fk.columnNames.indexOf("supplierId") !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey("order_items", foreignKey);
        }
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "supplierId"`);
    }
}
