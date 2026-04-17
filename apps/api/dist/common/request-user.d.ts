import type { Request } from 'express';
import type { UserRole } from '@elite-message/contracts';
export type RequestUser = {
    id: string;
    email: string;
    role: UserRole;
};
export type InstanceApiPrincipal = {
    tokenId: string;
    tokenType: 'instance_api';
    tokenName: string;
    tokenPrefix: string;
    workspaceId: string;
    instanceId: string;
    instancePublicId: string;
};
export type AppRequest = Request & {
    user?: RequestUser;
    instanceApi?: InstanceApiPrincipal;
};
//# sourceMappingURL=request-user.d.ts.map