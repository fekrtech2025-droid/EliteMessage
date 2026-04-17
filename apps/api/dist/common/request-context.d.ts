import { AsyncLocalStorage } from 'node:async_hooks';
type RequestContextStore = {
    requestId: string;
};
export declare const requestContext: AsyncLocalStorage<RequestContextStore>;
export {};
//# sourceMappingURL=request-context.d.ts.map