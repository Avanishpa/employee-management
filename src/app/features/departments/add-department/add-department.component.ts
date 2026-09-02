import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {Router, RouterLink } from '@angular/router';
import { DepartmentService } from '../../../core/services/department.service';
import { Department } from '../../../shared/components/models/department.model';

@Component({
  selector: 'app-add-department',
  standalone: true,
  imports: [ CommonModule,
    ReactiveFormsModule,
    RouterLink],
  templateUrl: './add-department.component.html',
  styleUrl: './add-department.component.scss'
})
export class AddDepartmentComponent {
 departmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private departmentService: DepartmentService
  ) {
    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      manager: ['', Validators.required],
      description: ['', Validators.required],
      status: ['Active', Validators.required]
    });
  }

  saveDepartment(): void {

    if (this.departmentForm.valid) {

      const department: Department = {
        id: 0,
        ...this.departmentForm.value
      };

      this.departmentService.addDepartment(department);

      alert('Department Added Successfully! 🎉');

      this.router.navigate(['/departments']);

    } else {

      this.departmentForm.markAllAsTouched();

    }
  }
}
