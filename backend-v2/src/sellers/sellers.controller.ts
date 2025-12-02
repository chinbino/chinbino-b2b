import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Delete,
  ParseIntPipe,
  Query
} from '@nestjs/common';
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';

@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Post()
  create(@Body() createSellerDto: CreateSellerDto) {
    return this.sellersService.create(createSellerDto);
  }

  @Get()
  findAll(@Query('includeDeleted') includeDeleted: string) {
    const includeDeletedBool = includeDeleted === 'true';
    return this.sellersService.findAll(includeDeletedBool);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sellersService.findOne(id);
  }

  @Get(':id/stats')
  getStats(@Param('id', ParseIntPipe) id: number) {
    return this.sellersService.getSellerStats(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSellerDto: UpdateSellerDto
  ) {
    return this.sellersService.update(id, updateSellerDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sellersService.remove(id);
  }

  // 🔴 endpoint جدید برای restore
  @Post(':id/restore')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.sellersService.restore(id);
  }

  // 🔴 endpoint جدید برای حذف کامل
  @Delete(':id/permanent')
  permanentDelete(@Param('id', ParseIntPipe) id: number) {
    return this.sellersService.permanentDelete(id);
  }

  // 🔴 endpoint تستی برای مشاهده deleted sellers
  @Get('deleted/list')
  getDeletedSellers() {
    return this.sellersService.getDeletedSellers();
  }
}
