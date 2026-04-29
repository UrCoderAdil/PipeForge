import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PluginsService } from './plugins.service';

@UseGuards(JwtAuthGuard)
@Controller('plugins')
export class PluginsController {
  constructor(private pluginsService: PluginsService) {}

  @Get()
  findAll() { return this.pluginsService.findAll(); }

  @Patch(':id/toggle')
  toggle(@Param('id') id: string) { return this.pluginsService.toggle(id); }
}