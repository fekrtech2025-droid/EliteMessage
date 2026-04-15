import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@elite-message/contracts';

export const requiredRolesKey = 'requiredRoles';

export const RequireRoles = (...roles: UserRole[]) =>
  SetMetadata(requiredRolesKey, roles);
