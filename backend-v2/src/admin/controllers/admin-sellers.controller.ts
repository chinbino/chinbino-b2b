import { Controller, Get, Render, Query, Param } from '@nestjs/common';
import { SellersService } from '../../sellers/sellers.service';

@Controller('admin/sellers')
export class AdminSellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Get()
  @Render('sellers-list') // 🔴 تغییر شد: 'admin/sellers-list' → 'sellers-list'
  async listSellers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('status') status: string,
    @Query('search') search: string,
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const sellers = await this.sellersService.findAll(true);
    
    let filteredSellers = sellers;
    if (status) {
      filteredSellers = sellers.filter(seller => seller.status === status);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredSellers = filteredSellers.filter(seller => 
        seller.nameZh.toLowerCase().includes(searchLower) ||
        seller.nameFa?.toLowerCase()?.includes(searchLower) ||
        seller.companyName?.toLowerCase()?.includes(searchLower) ||
        seller.contactPhone?.includes(search)
      );
    }

    const total = filteredSellers.length;
    const paginatedSellers = filteredSellers.slice(skip, skip + limitNum);

    return {
      sellers: paginatedSellers,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        limit: limitNum,
      },
      filters: {
        status,
        search,
      },
      statusOptions: ['pending', 'approved', 'rejected'],
    };
  }

  @Get('create')
  @Render('seller-create') // 🔴 تغییر شد
  createPage() {
    return {
      statusOptions: ['pending', 'approved', 'rejected'],
    };
  }

  @Get(':id/edit')
  @Render('seller-edit') // 🔴 تغییر شد
  async editPage(@Param('id') id: string) {
    const seller = await this.sellersService.findOne(parseInt(id, 10), true);
    
    return {
      seller,
      statusOptions: ['pending', 'approved', 'rejected'],
    };
  }
}
