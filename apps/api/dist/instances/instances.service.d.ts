import type { CreateInstanceRequest, CreateInstanceResponse, InstanceDetailResponse, ListCustomerInstancesResponse, PublicInstanceMeResponse, PublicInstanceQrCodeResponse, PublicInstanceStatusResponse, PublicUpdateInstanceSettingsRequest, RequestInstanceActionRequest, RequestInstanceActionResponse, RotateInstanceTokenResponse, UpdateInstanceSettingsRequest, UpdateInstanceSettingsResponse } from '@elite-message/contracts';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import type { InstanceApiPrincipal } from '../common/request-user';
import { RealtimeService } from '../realtime/realtime.service';
export declare class InstancesService {
    private readonly realtimeService;
    private readonly auditLogsService;
    constructor(realtimeService: RealtimeService, auditLogsService: AuditLogsService);
    listCustomerInstances(userId: string): Promise<ListCustomerInstancesResponse>;
    createCustomerInstance(userId: string, input: CreateInstanceRequest): Promise<CreateInstanceResponse>;
    getCustomerInstanceDetail(userId: string, instanceId: string): Promise<InstanceDetailResponse>;
    getAdminInstanceDetail(instanceId: string): Promise<InstanceDetailResponse>;
    getPublicInstanceStatus(principal: InstanceApiPrincipal): Promise<PublicInstanceStatusResponse>;
    getPublicInstanceMe(principal: InstanceApiPrincipal): Promise<PublicInstanceMeResponse>;
    getPublicInstanceSettings(principal: InstanceApiPrincipal): Promise<{
        id: string;
        sendDelay: number;
        sendDelayMax: number;
        webhookSecret: string;
        webhookMessageReceived: boolean;
        webhookMessageCreate: boolean;
        webhookMessageAck: boolean;
        createdAt: string;
        updatedAt: string;
        webhookUrl?: string | null | undefined;
    }>;
    getPublicInstanceQrCode(principal: InstanceApiPrincipal): Promise<PublicInstanceQrCodeResponse>;
    getPublicInstanceScreenshot(principal: InstanceApiPrincipal): Promise<{
        publicId: string;
        path: string;
        filename: string;
        capturedAt: string | null;
    }>;
    getCustomerInstanceScreenshot(userId: string, instanceId: string): Promise<{
        publicId: string;
        path: string;
        filename: string;
        capturedAt: string | null;
    }>;
    getAdminInstanceScreenshot(instanceId: string): Promise<{
        publicId: string;
        path: string;
        filename: string;
        capturedAt: string | null;
    }>;
    updateCustomerInstanceSettings(userId: string, instanceId: string, input: UpdateInstanceSettingsRequest): Promise<UpdateInstanceSettingsResponse>;
    updatePublicInstanceSettings(principal: InstanceApiPrincipal, input: PublicUpdateInstanceSettingsRequest): Promise<UpdateInstanceSettingsResponse>;
    requestCustomerInstanceAction(userId: string, instanceId: string, input: RequestInstanceActionRequest): Promise<RequestInstanceActionResponse>;
    requestPublicInstanceAction(principal: InstanceApiPrincipal, input: RequestInstanceActionRequest): Promise<RequestInstanceActionResponse>;
    requestAdminInstanceAction(userId: string, instanceId: string, input: RequestInstanceActionRequest): Promise<RequestInstanceActionResponse>;
    rotateCustomerInstanceToken(userId: string, instanceId: string): Promise<RotateInstanceTokenResponse>;
    private enqueueInstanceAction;
    private reassignInstance;
    private loadPublicScopedInstanceRuntime;
    private readRuntimeDiagnostics;
    private loadCustomerScopedInstanceDetail;
    private loadAdminScopedInstanceDetail;
    private ensureInstanceScaffolding;
    private getWorkerMap;
    private getAssignedWorker;
    private resolveScreenshotAsset;
}
//# sourceMappingURL=instances.service.d.ts.map