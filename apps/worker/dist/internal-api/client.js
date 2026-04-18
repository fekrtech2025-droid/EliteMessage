"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalApiClient = void 0;
const contracts_1 = require("@elite-message/contracts");
class InternalApiClient {
    options;
    constructor(options) {
        this.options = options;
    }
    registerWorker(payload) {
        return this.request('/api/v1/internal/workers/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        }, contracts_1.InternalWorkerRegisterResponseSchema);
    }
    claimNextInstance(workerId) {
        return this.request(`/api/v1/internal/workers/${workerId}/claim-next`, {
            method: 'POST',
        }, contracts_1.InternalClaimNextInstanceResponseSchema);
    }
    updateInstanceStatus(instanceId, payload) {
        return this.request(`/api/v1/internal/instances/${instanceId}/status`, {
            method: 'POST',
            body: JSON.stringify(payload),
        }, contracts_1.InstanceStatusPayloadSchema);
    }
    updateInstanceRuntime(instanceId, payload) {
        return this.request(`/api/v1/internal/instances/${instanceId}/runtime`, {
            method: 'POST',
            body: JSON.stringify(payload),
        }, contracts_1.InstanceRuntimeViewSchema);
    }
    updateInstanceOperationStatus(instanceId, operationId, payload) {
        return this.request(`/api/v1/internal/instances/${instanceId}/operations/${operationId}/status`, {
            method: 'POST',
            body: JSON.stringify(payload),
        }, contracts_1.InstanceOperationSummarySchema);
    }
    releaseInstance(workerId, payload) {
        return this.request(`/api/v1/internal/workers/${workerId}/release-instance`, {
            method: 'POST',
            body: JSON.stringify(payload),
        }, contracts_1.InstanceStatusPayloadSchema);
    }
    claimNextOutboundMessage(instanceId, payload) {
        return this.request(`/api/v1/internal/instances/${instanceId}/messages/claim-next`, {
            method: 'POST',
            body: JSON.stringify(payload),
        }, contracts_1.InternalClaimNextOutboundMessageResponseSchema);
    }
    updateOutboundMessage(instanceId, messageId, payload) {
        return this.request(`/api/v1/internal/instances/${instanceId}/messages/${messageId}/status`, {
            method: 'POST',
            body: JSON.stringify(payload),
        }, contracts_1.OutboundMessageSummarySchema);
    }
    receiveInboundMessage(instanceId, payload) {
        return this.request(`/api/v1/internal/instances/${instanceId}/messages/received`, {
            method: 'POST',
            body: JSON.stringify(payload),
        }, contracts_1.InboundMessageSummarySchema);
    }
    async request(path, init, parser) {
        const url = new URL(path.replace(/^\//, ''), this.options.baseUrl.endsWith('/')
            ? this.options.baseUrl
            : `${this.options.baseUrl}/`);
        const response = await fetch(url, {
            ...init,
            headers: {
                authorization: `Bearer ${this.options.internalToken}`,
                'content-type': 'application/json',
                ...(init.headers ?? {}),
            },
        });
        if (!response.ok) {
            const body = await response.text();
            throw new Error(`Internal API request failed (${response.status} ${response.statusText}): ${body}`);
        }
        const data = (await response.json());
        return parser.parse(data);
    }
}
exports.InternalApiClient = InternalApiClient;
//# sourceMappingURL=client.js.map