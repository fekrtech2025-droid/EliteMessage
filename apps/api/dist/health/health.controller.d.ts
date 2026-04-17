import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    getHealth(): {
        status: string;
        service: string;
    };
    getReady(): {
        ready: boolean;
        service: string;
    };
    getMetrics(): Promise<string>;
}
//# sourceMappingURL=health.controller.d.ts.map