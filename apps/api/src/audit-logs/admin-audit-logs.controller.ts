import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import type { AuditActorType, AuditEntityType } from '@elite-message/contracts';
import { routePrefixes } from '@elite-message/contracts';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { RequireRoles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AuditLogsService } from './audit-logs.service';

function parseLimit(input: unknown) {
  const raw =
    typeof input === 'string' ? Number.parseInt(input, 10) : Number.NaN;
  if (!Number.isFinite(raw)) {
    return 50;
  }

  return Math.min(Math.max(raw, 1), 200);
}

@Controller(routePrefixes.admin)
@UseGuards(AccessTokenGuard, RolesGuard)
@RequireRoles('platform_admin')
export class AdminAuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get('audit-logs')
  async listAuditLogs(
    @Query('workspaceId') workspaceId?: string,
    @Query('instanceId') instanceId?: string,
    @Query('actorType') actorType?: string,
    @Query('entityType') entityType?: string,
    @Query('action') action?: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditLogsService.listAdminAuditLogs({
      workspaceId,
      instanceId,
      actorType: actorType as AuditActorType | undefined,
      entityType: entityType as AuditEntityType | undefined,
      action,
      limit: parseLimit(limit),
    });
  }
}
