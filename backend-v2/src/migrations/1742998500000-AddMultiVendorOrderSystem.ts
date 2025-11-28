import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableColumn } from 'typeorm';

export class AddMultiVendorOrderSystem1742998500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ایجاد جدول seller_orders
    await queryRunner.createTable(new Table({
      name: 'seller_orders',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'orderId',
          type: 'uuid',
        },
        {
          name: 'sellerId',
          type: 'uuid',
        },
        {
          name: 'status',
          type: 'enum',
          enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
          default: "'pending'",
        },
        {
          name: 'subtotalCNY',
          type: 'decimal',
          precision: 12,
          scale: 2,
        },
        {
          name: 'subtotalIRR',
          type: 'decimal',
          precision: 12,
          scale: 2,
        },
        {
          name: 'shippingCostCNY',
          type: 'decimal',
          precision: 12,
          scale: 2,
          default: 0,
        },
        {
          name: 'shippingCostIRR',
          type: 'decimal',
          precision: 12,
          scale: 2,
          default: 0,
        },
        {
          name: 'totalCNY',
          type: 'decimal',
          precision: 12,
          scale: 2,
        },
        {
          name: 'totalIRR',
          type: 'decimal',
          precision: 12,
          scale: 2,
        },
        {
          name: 'createdAt',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'updatedAt',
          type: 'timestamp',
          default: 'now()',
        },
      ],
    }));

    // ایجاد جدول order_item_addons
    await queryRunner.createTable(new Table({
      name: 'order_item_addons',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'orderItemId',
          type: 'uuid',
        },
        {
          name: 'type',
          type: 'enum',
          enum: ['quality_guarantee', 'extended_warranty', 'fast_shipping', 'custom'],
        },
        {
          name: 'title',
          type: 'varchar',
        },
        {
          name: 'calculationType',
          type: 'enum',
          enum: ['percent', 'fixed'],
        },
        {
          name: 'valuePercent',
          type: 'decimal',
          precision: 5,
          scale: 2,
          isNullable: true,
        },
        {
          name: 'valueFixedCNY',
          type: 'decimal',
          precision: 12,
          scale: 2,
          isNullable: true,
        },
        {
          name: 'valueFixedIRR',
          type: 'decimal',
          precision: 12,
          scale: 2,
          isNullable: true,
        },
        {
          name: 'amountCNY',
          type: 'decimal',
          precision: 12,
          scale: 2,
        },
        {
          name: 'amountIRR',
          type: 'decimal',
          precision: 12,
          scale: 2,
        },
        {
          name: 'createdAt',
          type: 'timestamp',
          default: 'now()',
        },
      ],
    }));

    // اضافه کردن فیلدهای جدید به orders
    await queryRunner.addColumns('orders', [
      new TableColumn({
        name: 'totalProductsCNY',
        type: 'decimal',
        precision: 12,
        scale: 2,
      }),
      new TableColumn({
        name: 'totalProductsIRR',
        type: 'decimal',
        precision: 12,
        scale: 2,
      }),
      new TableColumn({
        name: 'totalShippingCNY',
        type: 'decimal',
        precision: 12,
        scale: 2,
        default: 0,
      }),
      new TableColumn({
        name: 'totalShippingIRR',
        type: 'decimal',
        precision: 12,
        scale: 2,
        default: 0,
      }),
      new TableColumn({
        name: 'totalAddonsCNY',
        type: 'decimal',
        precision: 12,
        scale: 2,
        default: 0,
      }),
      new TableColumn({
        name: 'totalAddonsIRR',
        type: 'decimal',
        precision: 12,
        scale: 2,
        default: 0,
      }),
      new TableColumn({
        name: 'grandTotalCNY',
        type: 'decimal',
        precision: 12,
        scale: 2,
      }),
      new TableColumn({
        name: 'grandTotalIRR',
        type: 'decimal',
        precision: 12,
        scale: 2,
      }),
      new TableColumn({
        name: 'baseCurrency',
        type: 'varchar',
        default: "'CNY'",
      }),
      new TableColumn({
        name: 'exchangeRateCNYToIRR',
        type: 'decimal',
        precision: 10,
        scale: 4,
      }),
    ]);

    // اضافه کردن فیلدهای جدید به order_items
    await queryRunner.addColumns('order_items', [
      new TableColumn({
        name: 'sellerOrderId',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'unitPriceCNY',
        type: 'decimal',
        precision: 12,
        scale: 2,
      }),
      new TableColumn({
        name: 'unitPriceIRR',
        type: 'decimal',
        precision: 12,
        scale: 2,
      }),
      new TableColumn({
        name: 'totalPriceCNY',
        type: 'decimal',
        precision: 12,
        scale: 2,
      }),
      new TableColumn({
        name: 'totalPriceIRR',
        type: 'decimal',
        precision: 12,
        scale: 2,
      }),
      new TableColumn({
        name: 'totalAddonsCNY',
        type: 'decimal',
        precision: 12,
        scale: 2,
        default: 0,
      }),
      new TableColumn({
        name: 'totalAddonsIRR',
        type: 'decimal',
        precision: 12,
        scale: 2,
        default: 0,
      }),
    ]);

    // ایجاد foreign keys
    await queryRunner.createForeignKeys('seller_orders', [
      new TableForeignKey({
        columnNames: ['orderId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['sellerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    ]);

    await queryRunner.createForeignKey('order_item_addons', new TableForeignKey({
      columnNames: ['orderItemId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'order_items',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKey('order_items', new TableForeignKey({
      columnNames: ['sellerOrderId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'seller_orders',
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // حذف foreign keys
    await queryRunner.dropForeignKey('order_items', 'FK_order_items_seller_order');
    await queryRunner.dropForeignKey('order_item_addons', 'FK_order_item_addons_order_item');
    const sellerOrderTable = await queryRunner.getTable('seller_orders');
const orderForeignKey = sellerOrderTable.foreignKeys.find(fk => fk.columnNames.indexOf('orderId') !== -1);
const sellerForeignKey = sellerOrderTable.foreignKeys.find(fk => fk.columnNames.indexOf('sellerId') !== -1);

if (orderForeignKey) {
  await queryRunner.dropForeignKey('seller_orders', orderForeignKey);
}
if (sellerForeignKey) {
  await queryRunner.dropForeignKey('seller_orders', sellerForeignKey);
}

    // حذف فیلدهای جدید
    await queryRunner.dropColumns('order_items', [
      'sellerOrderId', 'unitPriceCNY', 'unitPriceIRR', 
      'totalPriceCNY', 'totalPriceIRR', 'totalAddonsCNY', 'totalAddonsIRR'
    ]);

    await queryRunner.dropColumns('orders', [
      'totalProductsCNY', 'totalProductsIRR', 'totalShippingCNY', 'totalShippingIRR',
      'totalAddonsCNY', 'totalAddonsIRR', 'grandTotalCNY', 'grandTotalIRR',
      'baseCurrency', 'exchangeRateCNYToIRR'
    ]);

    // حذف جداول
    await queryRunner.dropTable('order_item_addons');
    await queryRunner.dropTable('seller_orders');
  }
}
