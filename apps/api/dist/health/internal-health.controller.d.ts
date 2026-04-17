import { HealthService } from './health.service';
export declare class InternalHealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    getHealth(): {
        status: string;
        service: string;
    };
    getMetrics(): Promise<string>;
}
//# sourceMappingURL=internal-health.controller.d.ts.map