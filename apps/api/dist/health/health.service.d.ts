import { MetricsService } from '../ops/metrics.service';
export declare class HealthService {
    private readonly metricsService;
    constructor(metricsService: MetricsService);
    getHealth(): {
        status: string;
        service: string;
    };
    getReadiness(): {
        ready: boolean;
        service: string;
    };
    getMetrics(): Promise<string>;
}
//# sourceMappingURL=health.service.d.ts.map