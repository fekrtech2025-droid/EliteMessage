import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MetricsService } from './metrics.service';
export declare class RetentionService implements OnModuleInit, OnModuleDestroy {
    private readonly metricsService;
    private readonly env;
    private readonly logger;
    private sweepTimer;
    private running;
    constructor(metricsService: MetricsService);
    onModuleInit(): void;
    onModuleDestroy(): void;
    runSweep(): Promise<void>;
}
//# sourceMappingURL=retention.service.d.ts.map