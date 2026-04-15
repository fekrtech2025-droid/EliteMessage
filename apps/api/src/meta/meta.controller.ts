import { Controller, Get } from '@nestjs/common';
import {
  authTokenTypeValues,
  queueNames,
  reservedRouteGroups,
  websocketEventNames,
} from '@elite-message/contracts';

@Controller('/api/v1/meta')
export class MetaController {
  @Get()
  getMeta() {
    return {
      service: 'api',
      version: '0.1.0',
      routeGroups: reservedRouteGroups,
      queueNames,
      websocketEvents: websocketEventNames,
      authTokenTypes: authTokenTypeValues,
    };
  }
}
