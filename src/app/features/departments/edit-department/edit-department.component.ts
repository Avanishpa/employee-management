import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
import { Department } from '../../../shared/components/models/department.model';
import { DepartmentService } from '../../../core/services/department.service';

@Component({
  selector: 'app-edit-department',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterLink],
  templateUrl: './edit-department.component.html',
  styleUrl: './edit-department.component.scss'
})
export class EditDepartmentComponent {
departmentForm: FormGroup;

  departmentId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
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

  ngOnInit(): void {

    this.departmentId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadDepartment();

  }

  // Load Department Data
  loadDepartment(): void {

    const department =
      this.departmentService.getDepartmentById(
        this.departmentId
      );

    if (department) {

      this.departmentForm.patchValue({
        name: department.name,
        manager: department.manager,
        description: department.description,
        status: department.status
      });

    } else {

      alert('Department not found!');

      this.router.navigate(['/departments']);

    }

  }

  // Update Department
  updateDepartment(): void {

    if (this.departmentForm.valid) {

      const updatedDepartment: Department = {
        id: this.departmentId,
        ...this.departmentForm.value
      };

      this.departmentService.updateDepartment(
        updatedDepartment
      );

      alert('Department Updated Successfully! 🎉');

      this.router.navigate(['/departments']);

    } else {

      this.departmentForm.markAllAsTouched();

    }

  }

}

