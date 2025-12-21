

export enum Gender {
  M = 'M',
  F = 'F',
  O = 'O',
}

export enum Religion {
  HINDU = 'HINDU',
  MUSLIM = 'MUSLIM',
  CHRISTIAN = 'CHRISTIAN',
  SIKH = 'SIKH',
  BUDDHIST = 'BUDDHIST',
  JAIN = 'JAIN',
  OTHER = 'OTHER',
}

export enum Category {
  GENERAL = 'GENERAL',
  OBC = 'OBC',
  SC = 'SC',
  ST = 'ST',
}
export enum IsStayingHear{
  Yes = 'Yes',
  No = 'No',
}

export enum EmergencyRelationship {
  PARENT = 'PARENT',
  SPOUSE = 'SPOUSE',
  SIBLING = 'SIBLING',
  FRIEND = 'FRIEND',
  OTHER = 'OTHER',
}

export enum HighestQualification {
  TEN = '10',
  TWELVE = '12',
  UG = 'UG',
  PG = 'PG',
  PHD = 'PHD',
}

export enum GradingSystem {
  PERCENTAGE = 'percentage',
  CGPA = 'cgpa',
  GRADE = 'grade',
}

export class DocumentDto {
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
}

export class EducationDetailDto {
  qualification: string;
  board: string;
  schoolName: string;
  passingYear: string;
  gradingSystem: GradingSystem;
  percentage?: number;
  cgpa?: number;
  grade?: string;
  documents: DocumentDto[];
}

export class EducationDto {
  highestQualification: HighestQualification;
  educationDetails: EducationDetailDto[];
}

export class AddressDto {
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  statyingHear:IsStayingHear
}

export class EmployeeKycDto {
  aadharNo: string;
  mobileNo: string;
  pan: string;
  fullName: string;
  dob: string; // ISO date: YYYY-MM-DD
  gender: Gender;
  bloodGroup: string;
  religion: Religion;
  category: Category;
  personalEmail: string;
  alternateMobile: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyRelationship: EmergencyRelationship;
  presentAddress: AddressDto;
  permanentAddress: AddressDto;
}
