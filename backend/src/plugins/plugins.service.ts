import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface IPlugin {
  init(): void;
  execute(context: any): Promise<void>;
  destroy(): void;
}

export class SlackNotifierPlugin implements IPlugin {
  init() { console.log('[Plugin] Slack Notifier initialized'); }
  async execute(ctx: any) { console.log('[Plugin] Slack notification sent:', ctx.message); }
  destroy() { console.log('[Plugin] Slack Notifier destroyed'); }
}

export class EmailNotifierPlugin implements IPlugin {
  init() { console.log('[Plugin] Email Notifier initialized'); }
  async execute(ctx: any) { console.log('[Plugin] Email sent:', ctx.message); }
  destroy() {}
}

export class DiscordAlertPlugin implements IPlugin {
  init() {}
  async execute(ctx: any) { console.log('[Plugin] Discord alert:', ctx.message); }
  destroy() {}
}

@Injectable()
export class PluginsService {
  private pluginRegistry: Record<string, IPlugin> = {
    'Slack Notifier': new SlackNotifierPlugin(),
    'Email Notifier': new EmailNotifierPlugin(),
    'Discord Alerts': new DiscordAlertPlugin(),
  };

  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.plugin.findMany({ orderBy: { name: 'asc' } });
  }

  async toggle(id: string) {
    const plugin = await this.prisma.plugin.findUnique({ where: { id } });
    if (!plugin) throw new Error('Plugin not found');
    const updated = await this.prisma.plugin.update({ where: { id }, data: { enabled: !plugin.enabled } });

    const instance = this.pluginRegistry[plugin.name];
    if (instance) {
      if (updated.enabled) instance.init();
      else instance.destroy();
    }

    return updated;
  }
}