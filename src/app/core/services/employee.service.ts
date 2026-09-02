import { Injectable } from '@angular/core';
import { Employee } from '../../shared/components/models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor() {
}

   private employees: Employee[] = [
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'Rahul Sharma',
      email: 'rahul@gmail.com',
      phone: '9876543210',
      department: 'IT',
      designation: 'Angular Developer',
      joiningDate: '2025-01-10',
      status: 'Active'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      name: 'Priya Patel',
      email: 'priya@gmail.com',
      phone: '9876543211',
      department: 'HR',
      designation: 'HR Manager',
      joiningDate: '2024-08-15',
      status: 'Active'
    },
    {
      id: 3,
      employeeId: 'EMP003',
      name: 'Amit Kumar',
      email: 'amit@gmail.com',
      phone: '9876543212',
      department: 'Finance',
      designation: 'Accountant',
      joiningDate: '2023-05-20',
      status: 'Inactive'
    },
     {
      id: 4,
      employeeId: 'EMP004',
      name: 'Amit Kumar',
      email: 'amit@gmail.com',
      phone: '9876543212',
      department: 'Finance',
      designation: 'Accountant',
      joiningDate: '2023-05-20',
      status: 'Inactive'
    },
     {
      id: 5,
      employeeId: 'EMP005',
      name: 'Amit Kumar',
      email: 'amit@gmail.com',
      phone: '9876543212',
      department: 'Finance',
      designation: 'Accountant',
      joiningDate: '2023-05-20',
      status: 'Inactive'
    },
     {
      id: 6,
      employeeId: 'EMP006',
      name: 'Amit Kumar',
      email: 'amit@gmail.com',
      phone: '9876543212',
      department: 'Finance',
      designation: 'Accountant',
      joiningDate: '2023-05-20',
      status: 'Inactive'
    },
     {
      id: 7,
      employeeId: 'EMP007',
      name: 'Amit Kumar',
      email: 'amit@gmail.com',
      phone: '9876543212',
      department: 'Finance',
      designation: 'Accountant',
      joiningDate: '2023-05-20',
      status: 'Inactive'
    },
     {
      id: 8,
      employeeId: 'EMP008',
      name: 'Amit Kumar',
      email: 'amit@gmail.com',
      phone: '9876543212',
      department: 'Finance',
      designation: 'Accountant',
      joiningDate: '2023-05-20',
      status: 'Inactive'
    },
     {
      id: 9,
      employeeId: 'EMP009',
      name: 'Amit Kumar',
      email: 'amit@gmail.com',
      phone: '9876543212',
      department: 'Finance',
      designation: 'Accountant',
      joiningDate: '2023-05-20',
      status: 'Inactive'
    },
     {
      id: 10,
      employeeId: 'EMP0010',
      name: 'Amit Kumar',
      email: 'amit@gmail.com',
      phone: '9876543212',
      department: 'Finance',
      designation: 'Accountant',
      joiningDate: '2023-05-20',
      status: 'Inactive'
    },
     {
      id: 11,
      employeeId: 'EMP0011',
      name: 'Amit Kumar',
      email: 'amit@gmail.com',
      phone: '9876543212',
      department: 'Finance',
      designation: 'Accountant',
      joiningDate: '2023-05-20',
      status: 'Inactive'
    },
     {
      id: 12,
      employeeId: 'EMP0012',
      name: 'Amit Kumar',
      email: 'amit@gmail.com',
      phone: '9876543212',
      department: 'Finance',
      designation: 'Accountant',
      joiningDate: '2023-05-20',
      status: 'Inactive'
    }

  ];

  getEmployees(): Employee[] {
    return this.employees;
  }

  getEmployeeById(id: number): Employee | undefined {
    return this.employees.find(employee => employee.id === id);
  }

  addEmployee(employee: Employee): void {

    const newId = this.employees.length
      ? Math.max(...this.employees.map(emp => emp.id)) + 1
      : 1;

    employee.id = newId;

    this.employees.push(employee);
  }

  updateEmployee(updatedEmployee: Employee): void {

    const index = this.employees.findIndex(
      employee => employee.id === updatedEmployee.id
    );

    if (index !== -1) {
      this.employees[index] = updatedEmployee;
    }
  }

  deleteEmployee(id: number): void {
    this.employees = this.employees.filter(
      employee => employee.id !== id
    );
  }
}
