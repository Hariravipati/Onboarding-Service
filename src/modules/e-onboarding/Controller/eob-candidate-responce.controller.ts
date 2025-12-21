import { Body, Post } from "@nestjs/common";
import { EducationDto, EmployeeKycDto } from "../dto/eob-responce.dto";

export class EobCandidateResponceController{
    constructor(){

    }

@Post()
  createEmployeeKyc(@Body() employeeKycDto: EmployeeKycDto) {
    // For now just returning received data
    return {
      message: 'Employee KYC created successfully',
      data: employeeKycDto,
    };
  }


  @Post('save-education-details')
  saveEducationDetails(@Body() educationDto: EducationDto) {
    // For now just returning received data
    return {
      message: 'Education details saved successfully',
      data: educationDto,
    };
  }

}