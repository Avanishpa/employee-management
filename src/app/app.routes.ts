import { authGuard } from './core/guards/auth.guard';
import { Component } from '@angular/core';
import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { EmployeeListComponent } from './features/employees/employee-list/employee-list.component';
import { AddEmployeeComponent } from './features/employees/add-employee/add-employee.component';
import { EditEmployeeComponent } from './features/employees/edit-employee/edit-employee.component';
import { DepartmentListComponent } from './features/departments/department-list/department-list.component';
import { AddDepartmentComponent } from './features/departments/add-department/add-department.component';
import { EditDepartmentComponent } from './features/departments/edit-department/edit-department.component';
import { MarkAttendanceComponent } from './features/attendance/mark-attendance/mark-attendance.component';
import { AttendanceHistoryComponent } from './features/attendance/attendance-history/attendance-history.component';
import { ReportsComponent } from './features/reports/reports.component';
import { EmployeeProfileComponent } from './features/employee-profile/employee-profile.component';
import { LoginComponent } from './features/auth/login/login.component';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
  component: LoginComponent
  },
     {
  
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [

      {
        path: 'dashboard',
        component: DashboardComponent,
         canActivate: [roleGuard],
  data: {
    roles: ['admin']
  }
      },
       {
        path: 'employees',
        component: EmployeeListComponent,
         canActivate: [roleGuard],
  data: {
    roles: ['admin']
  }
      },
{
  path: 'employee-profile/:id',
  component: EmployeeProfileComponent
},
      {
        path: 'employees/add',
        component: AddEmployeeComponent
      },
{
  path: 'employees/edit/:id',
  component: EditEmployeeComponent
},
{
  path: 'departments',
  component: DepartmentListComponent,
   canActivate: [roleGuard],
  data: {
    roles: ['admin']
  }
},
{
  path: 'departments/add',
  component: AddDepartmentComponent
},
{
  path: 'departments/edit/:id',
  component: EditDepartmentComponent
},
{
  path: 'attendance/mark',
  component: MarkAttendanceComponent,
   canActivate: [roleGuard],
  data: {
    roles: ['admin']
  }
},
{
  path: 'attendance/history',
  component: AttendanceHistoryComponent,
   canActivate: [roleGuard],
  data: {
    roles: ['admin']
  }
},
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
        {
    path: 'dashboard',
    component: DashboardComponent
  },

  {
    path: 'reports',
    component: ReportsComponent,
     canActivate: [roleGuard],
  data: {
    roles: ['admin']
  }
  },

    ]
    
  }
];
