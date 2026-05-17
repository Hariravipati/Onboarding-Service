import { Injectable } from '@nestjs/common';
import { VendorType } from '../enums/vendor-type.enum';
import { IVerificationProvider } from '../interfaces/verification-provider.interface';
import { EqualProvider } from '../providers/equal/equal.provider';
import { HyperVergeProvider } from '../providers/hyperverge/hyperverge.provider';
import { MockProvider } from '../providers/mock/mock.provider';

@Injectable()
export class VerificationProviderFactory {
  constructor(
    private readonly equalProvider: EqualProvider,
    private readonly mockProvider: MockProvider,
    private readonly hyperVergeProvider: HyperVergeProvider,
  ) {}

  getProvider(vendor: VendorType): IVerificationProvider {
    switch (vendor) {
      case VendorType.EQUAL:
        return this.equalProvider;
      case VendorType.MOCK:
        return this.mockProvider;
      case VendorType.HYPERVERGE:
        return this.hyperVergeProvider;
      default:
        throw new Error(`Unsupported verification vendor: ${vendor}`);
    }
  }
}
