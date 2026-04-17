import type { Response } from 'express';
import { MessagesService } from './messages.service';
export declare class PublicCustomerMediaController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    getCustomerMediaAsset(assetId: string, fileName: string, response: Response): Promise<void>;
}
//# sourceMappingURL=public-customer-media.controller.d.ts.map