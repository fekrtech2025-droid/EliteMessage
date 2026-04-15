import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CreateSupportCaseRequestSchema,
  SupportCasePriority,
  SupportCaseStatus,
  UpdateSupportCaseRequestSchema,
  routePrefixes,
} from '@elite-message/contracts';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { RequireRoles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../common/current-user.decorator';
import type { RequestUser } from '../common/request-user';
import { SupportCasesService } from './support-cases.service';

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
export class AdminSupportCasesController {
  constructor(private readonly supportCasesService: SupportCasesService) {}

  @Get('support-cases')
  async listSupportCases(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('workspaceId') workspaceId?: string,
    @Query('assignedAdminUserId') assignedAdminUserId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.supportCasesService.listSupportCases({
      status: status as SupportCaseStatus | undefined,
      priority: priority as SupportCasePriority | undefined,
      workspaceId,
      assignedAdminUserId,
      limit: parseLimit(limit),
    });
  }

  @Post('support-cases')
  async createSupportCase(
    @CurrentUser() user: RequestUser,
    @Body() body: unknown,
  ) {
    const payload = CreateSupportCaseRequestSchema.parse(body);
    return this.supportCasesService.createSupportCase(user.id, payload);
  }

  @Patch('support-cases/:caseId')
  async updateSupportCase(
    @CurrentUser() user: RequestUser,
    @Param('caseId') caseId: string,
    @Body() body: unknown,
  ) {
    const payload = UpdateSupportCaseRequestSchema.parse(body);
    return this.supportCasesService.updateSupportCase(user.id, caseId, payload);
  }
}
