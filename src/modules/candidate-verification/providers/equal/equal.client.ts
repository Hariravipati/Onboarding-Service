import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { withRetry } from '../../utils/retry.util';
import { VendorApiException } from '../../exceptions/vendor-api.exception';

@Injectable()
export class EqualClient {
  private readonly logger = new Logger(EqualClient.name);

  constructor(private readonly configService: ConfigService) {}

  async executeJourney(payload: Record<string, any>): Promise<any> {
    const baseUrl = this.configService.get<string>('EQUAL_BASE_URL');
    const apiKey = this.configService.get<string>('EQUAL_API_KEY');
    const timeout = this.configService.get<number>('HTTP_TIMEOUT_MS') || 10000;
    const retries = this.configService.get<number>('HTTP_RETRY_COUNT') || 3;

    return withRetry(async () => {
      try {
        const response = await axios.post(
          `${baseUrl}/ie/transaction/journey/execute`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout,
          },
        );
        return response.data;
      } catch (err) {
        this.logger.error('Equal API call failed', err?.response?.data || err.message);
        throw new VendorApiException('equal', err?.response?.data?.message || err.message, err);
      }
    }, retries);
  }
}
