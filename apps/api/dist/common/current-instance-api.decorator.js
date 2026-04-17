"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentInstanceApi = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentInstanceApi = (0, common_1.createParamDecorator)((_, context) => {
    const request = context.switchToHttp().getRequest();
    return request.instanceApi;
});
//# sourceMappingURL=current-instance-api.decorator.js.map