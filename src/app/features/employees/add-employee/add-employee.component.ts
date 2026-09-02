import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../shared/components/models/employee.model';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss'
})
export class AddEmployeeComponent {
employeeForm: FormGroup;
selectedPhoto: string = '';

  constructor(
    private fb: FormBuilder,
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

  saveEmployee(): void {

    if (this.employeeForm.valid) {

      const employee: Employee = {
        id: 0,
        ...this.employeeForm.value,
  photo: this.selectedPhoto
      };

      this.employeeService.addEmployee(employee);

      alert('Employee Added Successfully! 🎉');

      this.router.navigate(['/employees']);

    } else {

      this.employeeForm.markAllAsTouched();

    }
  }
  onPhotoSelected(event: Event): void {

  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {

    const file = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      this.selectedPhoto = reader.result as string;
    };

    reader.readAsDataURL(file);
  }
}
}
