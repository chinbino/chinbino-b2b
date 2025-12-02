import { Controller, Get, Render, Query } from '@nestjs/common';
import { SellersService } from '../../sellers/sellers.service';

@Controller('admin/sellers')
export class AdminSellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Get()
  @Render('admin/sellers-list')
  async listSellers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('status') status: string,
    @Query('search') search: string,
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    // دریافت Sellerها از Service
    const sellers = await this.sellersService.findAll(true); // شامل deletedها
    
    // فیلتر بر اساس status
    let filteredSellers = sellers;
    if (status) {
      filteredSellers = sellers.filter(seller => seller.status === status);
    }
    
    // جستجو
    if (search) {
      const searchLower = search.toLowerCase();
      filteredSellers = filteredSellers.filter(seller => 
        seller.nameZh.toLowerCase().includes(searchLower) ||
        seller.nameFa?.toLowerCase()?.includes(searchLower) ||
        seller.companyName?.toLowerCase()?.includes(searchLower) ||
        seller.contactPhone?.includes(search)
      );
    }

    // Pagination
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
  @Render('admin/seller-create')
  createPage() {
    return {
      statusOptions: ['pending', 'approved', 'rejected'],
    };
  }

  @Get(':id/edit')
  @Render('admin/seller-edit')
  async editPage(@Param('id') id: string) {
    const seller = await this.sellersService.findOne(parseInt(id, 10), true);
    
    return {
      seller,
      statusOptions: ['pending', 'approved', 'rejected'],
    };
  }
}
