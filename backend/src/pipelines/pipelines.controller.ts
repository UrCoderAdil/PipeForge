import { Controller, Get, Post, Patch, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PipelinesService } from './pipelines.service';
import { CreatePipelineDto } from './dto/create-pipeline.dto';

@UseGuards(JwtAuthGuard)
@Controller('pipelines')
export class PipelinesController {
  constructor(private pipelinesService: PipelinesService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.pipelinesService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pipelinesService.findOne(id);
  }

  @Post()
  create(@Request() req: any, @Body() dto: CreatePipelineDto) {
    return this.pipelinesService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreatePipelineDto>) {
    return this.pipelinesService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.pipelinesService.delete(id);
  }

  @Post(':id/clone')
  clone(@Param('id') id: string, @Request() req: any) {
    return this.pipelinesService.clone(id, req.user.id);
  }

  @Post('template/:template')
  fromTemplate(@Param('template') template: string, @Request() req: any) {
    return this.pipelinesService.createFromTemplate(template, req.user.id);
  }
}