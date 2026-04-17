export declare function createTotpSecret(): string;
export declare function generateTotpCode(secret: string, now?: number): string;
export declare function buildOtpauthUrl(issuer: string, accountLabel: string, secret: string): string;
export declare function verifyTotp(secret: string, code: string, now?: number, window?: number): boolean;
//# sourceMappingURL=totp.d.ts.map