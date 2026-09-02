import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';
import { Employee } from '../../../shared/components/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterLink],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.scss'
})
export class EditEmployeeComponent {
employeeForm: FormGroup;

  employeeId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {

    this.employeeForm = this.fb.group({
      employeeId: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      joiningDate: ['', Validators.required],
      status: ['Active', Validators.required]
    });

  }

  ngOnInit(): void {

    this.employeeId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadEmployee();

  }

  loadEmployee(): void {

    const employee = this.employeeService.getEmployeeById(
      this.employeeId
    );

    if (employee) {

      this.employeeForm.patchValue({
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        designation: employee.designation,
        joiningDate: employee.joiningDate,
        status: employee.status
      });

    } else {

      alert('Employee not found!');
      this.router.navigate(['/employees']);

    }

  }

  updateEmployee(): void {

    if (this.employeeForm.valid) {

      const updatedEmployee: Employee = {
        id: this.employeeId,
        ...this.employeeForm.value
      };

      this.employeeService.updateEmployee(updatedEmployee);

      alert('Employee Updated Successfully! 🎉');

      this.router.navigate(['/employees']);

    } else {

      this.employeeForm.markAllAsTouched();

    }

  }

}
