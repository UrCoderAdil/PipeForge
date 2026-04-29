import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RollbackService } from './rollback.service';

@UseGuards(JwtAuthGuard)
@Controller('execution')
export class RollbackController {
  constructor(private rollbackService: RollbackService) {}

  @Post('rollback/:executionId')
  rollback(@Param('executionId') executionId: string) {
    return this.rollbackService.rollback(executionId);
  }
}