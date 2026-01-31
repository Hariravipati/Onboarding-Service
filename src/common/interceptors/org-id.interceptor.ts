import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class OrgIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const orgId = request.headers['x-org-id'];

    if (!orgId) {
      throw new BadRequestException('x-org-id header is required');
    }

    return next.handle();
  }
}