import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export const OrgId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    const orgId = request.headers['x-tenant-id'];
    
    if (!orgId) {
      throw new BadRequestException('x-tenant-id header is required');
    }
    
    const parsedOrgId = parseInt(orgId, 10);
    if (isNaN(parsedOrgId)) {
      throw new BadRequestException('x-tenant-id must be a valid number');
    }
    
    return parsedOrgId;
  },
);