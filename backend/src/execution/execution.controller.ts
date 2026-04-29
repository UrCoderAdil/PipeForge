import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionService } from './execution.service';

@UseGuards(JwtAuthGuard)
@Controller('execution')
export class ExecutionController {
  constructor(private executionService: ExecutionService) {}

  @Post('start/:pipelineId')
  start(
    @Param('pipelineId') pipelineId: string,
    @Body() body: { forceFail?: boolean; failStage?: string },
  ) {
    return this.executionService.startExecution(pipelineId, body);
  }

  @Get('history')
  history() {
    return this.executionService.getHistory();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.executionService.getOne(id);
  }
}