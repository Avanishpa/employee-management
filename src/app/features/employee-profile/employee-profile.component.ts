import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';
import { AttendanceService } from '../../core/services/attendance.service';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.scss'
})
export class EmployeeProfileComponent
implements OnInit {


  employee: any;

  employeeId!: number;


  // ATTENDANCE SUMMARY

  totalAttendance = 0;

  presentCount = 0;

  absentCount = 0;

  lateCount = 0;

  workFromHomeCount = 0;


  constructor(

    private route:
      ActivatedRoute,

    private router:
      Router,

    private employeeService:
      EmployeeService,

    private attendanceService:
      AttendanceService

  ) {}


  ngOnInit(): void {

    this.employeeId =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    this.loadEmployee();

    this.loadAttendanceSummary();

  }


  // ========================================
  // LOAD EMPLOYEE
  // ========================================

  loadEmployee(): void {

    const employees =
      this.employeeService.getEmployees();


    this.employee =
      employees.find(
        (emp: any) =>
          emp.id === this.employeeId
      );


    if (!this.employee) {

      this.router.navigate(
        ['/employees']
      );

    }

  }


  // ========================================
  // ATTENDANCE SUMMARY
  // ========================================

  loadAttendanceSummary(): void {

    const attendanceRecords =
      this.attendanceService.getAttendance();


    const employeeAttendance =
      attendanceRecords.filter(
        (record: any) =>
          record.employeeId ===
          this.employeeId
      );


    this.totalAttendance =
      employeeAttendance.length;


    this.presentCount =
      employeeAttendance.filter(
        (record: any) =>
          record.status === 'Present'
      ).length;


    this.absentCount =
      employeeAttendance.filter(
        (record: any) =>
          record.status === 'Absent'
      ).length;


    this.lateCount =
      employeeAttendance.filter(
        (record: any) =>
          record.status === 'Late'
      ).length;


    this.workFromHomeCount =
      employeeAttendance.filter(
        (record: any) =>
          record.status ===
          'Work From Home'
      ).length;

  }


  // ========================================
  // GO BACK
  // ========================================

  goBack(): void {

    this.router.navigate(
      ['/employees']
    );

  }


  // ========================================
  // EDIT EMPLOYEE
  // ========================================

  editEmployee(): void {

    this.router.navigate(
      ['/employees/edit', this.employeeId]
    );

  }

}
