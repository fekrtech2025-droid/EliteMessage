"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireRoles = exports.requiredRolesKey = void 0;
const common_1 = require("@nestjs/common");
exports.requiredRolesKey = 'requiredRoles';
const RequireRoles = (...roles) => (0, common_1.SetMetadata)(exports.requiredRolesKey, roles);
exports.RequireRoles = RequireRoles;
//# sourceMappingURL=roles.decorator.js.map