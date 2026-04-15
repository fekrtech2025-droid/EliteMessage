import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import type { AuditEntityType } from '@elite-message/contracts';
import { routePrefixes } from '@elite-message/contracts';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { CurrentUser } from '../common/current-user.decorator';
import type { RequestUser } from '../common/request-user';
import { AuditLogsService } from './audit-logs.service';

function parseLimit(input: unknown) {
  const raw =
    typeof input === 'string' ? Number.parseInt(input, 10) : Number.NaN;
  if (!Number.isFinite(raw)) {
    return 50;
  }

  return Math.min(Math.max(raw, 1), 200);
}

@Controller(routePrefixes.account)
@UseGuards(AccessTokenGuard)
export class AccountAuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get('audit-logs')
  async listAuditLogs(
    @CurrentUser() user: RequestUser,
    @Query('workspaceId') workspaceId?: string,
    @Query('instanceId') instanceId?: string,
    @Query('action') action?: string,
    @Query('entityType') entityType?: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditLogsService.listAccountAuditLogs(user.id, {
      workspaceId,
      instanceId,
      action,
      entityType: entityType as AuditEntityType | undefined,
      limit: parseLimit(limit),
    });
  }
}
