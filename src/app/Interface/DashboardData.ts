export interface DashboardMetrics {
  totalEmployees: number;
  projectsActive: number;
  billable_FTEs: number;
  unassignedEmployees: number;
}

export interface RoleCount {
  role: string;
  count: number;
}

export interface AssignedProjects {
  project: string;
  assignedEmployees: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  employeeDistribution: RoleCount[];
  projectAssignments: AssignedProjects[];
}