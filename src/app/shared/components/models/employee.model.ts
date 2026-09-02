export interface Employee {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  position?:string;
  status: 'Active' | 'Inactive';
  photo?: string;
}

