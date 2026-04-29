import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/',
})
export class ExecutionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @OnEvent('execution.started')
  handleExecutionStarted(payload: any) {
    this.server.emit('execution:start', payload);
  }

  @OnEvent('execution.stage')
  handleStageUpdate(payload: any) {
    this.server.emit('execution:stage', payload);
  }

  @OnEvent('execution.log')
  handleLog(payload: any) {
    this.server.emit('execution:log', payload);
  }

  @OnEvent('execution.success')
  handleSuccess(payload: any) {
    this.server.emit('execution:success', payload);
  }

  @OnEvent('execution.failed')
  handleFailed(payload: any) {
    this.server.emit('execution:failed', payload);
  }

  @OnEvent('execution.rollback')
  handleRollback(payload: any) {
    this.server.emit('execution:rollback', payload);
  }

  @OnEvent('execution.rollback.complete')
  handleRollbackComplete(payload: any) {
    this.server.emit('execution:rollback:complete', payload);
  }
}