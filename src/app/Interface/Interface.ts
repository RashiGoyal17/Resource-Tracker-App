// ✅ Updated to match your C# Employee model exactly
export interface Employee {
  empId?: number;
  name: string;
  designation?: string;
  ReportingTo?: string;  // ✅ Capital 'R' to match C# model
  billable: boolean;     // ✅ Changed from 'yes'|'no' to boolean to match C# model
  skill?: string;
  project?: string;
  location?: string;
  email: string;
  doj?: string;         // ISO date string (YYYY-MM-DD)
  remarks?: string;
}

// ✅ Updated CreateEmployeeRequest to match C# model
export interface CreateEmployeeRequest {
  empId?: number;
  name: string;
  designation?: string;
  ReportingTo?: string;  // ✅ Capital 'R' to match C# model
  billable: boolean;     // ✅ boolean to match C# model
  skill?: string;
  project?: string;
  location?: string;
  email: string;
  doj?: string;         // ISO date string (YYYY-MM-DD)
  remarks?: string;
}

// ✅ If you need a display interface that uses 'yes'/'no' for UI purposes,
// create a separate interface for that:
export interface EmployeeDisplayModel {
  empId?: number;
  name: string;
  designation?: string;
  ReportingTo?: string;
  billable: 'yes' | 'no';  // For display purposes only
  skill?: string;
  project?: string;
  location?: string;
  email: string;
  doj?: string;
  remarks?: string;
}