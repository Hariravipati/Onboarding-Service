import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export const TenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-id'];

    if (!tenantId) {
      throw new BadRequestException('x-tenant-id header is required');
    }

    const parsedTenantId = parseInt(tenantId, 10);
    if (isNaN(parsedTenantId)) {
      throw new BadRequestException('x-tenant-id must be a valid number');
    }

    return parsedTenantId;
  },
);
