export class CandidateDetailsResponseDto {
  candidateId: number;
  fullName: string;
  email: string;
  mobileNo?: string;
  aadharNo?: string;
  panNo?: string;
  passportNo?: string;
  uanNo?: string;
  customFieldsJson?: any;
  otherDetailsJson?: any;
  documents?: EOnboardingDocumentResponseDto[];
}

export class EOnboardingDocumentResponseDto {
  candidateDocumentId: number;
  docId: number;
  docType: string;
  docUrl: string;
}