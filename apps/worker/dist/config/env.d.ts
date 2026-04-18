export declare function loadWorkerEnv(): {
    NODE_ENV: "development" | "test" | "production";
    LOG_LEVEL: string;
    ENABLE_EXTERNAL_CONNECTIONS: boolean;
    WORKER_APP_NAME: string;
    WORKER_PORT: number;
    WORKER_HEARTBEAT_INTERVAL_MS: number;
    WORKER_CONTROL_LOOP_INTERVAL_MS: number;
    WORKER_ID: string;
    WORKER_REGION: string;
    WORKER_MAX_AUTO_ASSIGNMENTS: number;
    WORKER_SESSION_BACKEND: "placeholder" | "whatsapp_web";
    WORKER_SESSION_STORAGE_DIR: string;
    WORKER_PLACEHOLDER_QR_DISPLAY_MS: number;
    WORKER_WA_HEADLESS: boolean;
    WORKER_WA_CAPTURE_SCREENSHOTS: boolean;
    WORKER_WA_DOWNLOAD_INBOUND_MEDIA: boolean;
    WORKER_WA_STARTUP_TIMEOUT_MS: number;
    WORKER_WA_AUTO_RECOVERY_DELAY_MS: number;
    API_BASE_URL: string;
    API_INTERNAL_TOKEN: string;
    WORKER_WA_BROWSER_EXECUTABLE_PATH?: string | undefined;
} & {
    DATABASE_URL: string;
    POSTGRES_HOST: string;
    POSTGRES_PORT: number;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
} & {
    REDIS_URL: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
} & {
    S3_ENDPOINT: string;
    S3_PORT: number;
    S3_ACCESS_KEY: string;
    S3_SECRET_KEY: string;
    S3_BUCKET: string;
    S3_REGION: string;
};
//# sourceMappingURL=env.d.ts.map