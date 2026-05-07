import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { DriftDetectionService } from './drift-detection.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('drift-detection')
export class DriftDetectionController {
  constructor(private readonly service: DriftDetectionService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('open')
  getOpen() {
    return this.service.getOpen();
  }

  @Get('metrics')
  getMetrics() {
    return this.service.getMetrics();
  }

  @Post('check')
  runCheck(@Body() body: { modelName: string }) {
    return this.service.runCheck(body.modelName);
  }

  @Post(':id/acknowledge')
  acknowledge(@Param('id') id: string) {
    return this.service.acknowledge(id);
  }

  @Post(':id/resolve')
  resolve(@Param('id') id: string) {
    return this.service.resolve(id);
  }
}
