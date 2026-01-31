import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export const OrgId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    const orgId = request.headers['x-org-id'];
    
    if (!orgId) {
      throw new BadRequestException('x-org-id header is required');
    }
    
    const parsedOrgId = parseInt(orgId, 10);
    if (isNaN(parsedOrgId)) {
      throw new BadRequestException('x-org-id must be a valid number');
    }
    
    return parsedOrgId;
  },
);