import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ExperimentsService } from './experiments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('experiments')
export class ExperimentsController {
  constructor(private readonly service: ExperimentsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Post('compare')
  compare(@Body() body: { ids: string[] }) {
    return this.service.compare(body.ids);
  }
}
