import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  findAll() { return this.notificationsService.findAll(); }

  @Patch(':id/read')
  markRead(@Param('id') id: string) { return this.notificationsService.markRead(id); }

  @Patch('all/read')
  markAllRead() { return this.notificationsService.markAllRead(); }
}