export type MappingType = "employeeId" | "teamId" | "areaId" | "cityId" | "countryId"

export interface Mapping {
  type: MappingType
  value: string
}

export interface Report {
  id: string
  name: string
  region: string
  supervisors: string[]
  mappings: Mapping[]
}

export interface Employee {
  id: string
  name: string
  teamId: string
  teamName: string
  areaId: string
  cityId: string
  cityName: string
  countryId: string
  countryName: string
  location: string
  supervisorId: string | null
  title: string
}

export interface EmployeeWithMappings extends Employee {
  report_count: number
  mapped_reports: string | null
}

// Employee details with additional information
export interface EmployeeDetails extends Employee {
  email?: string
  phone?: string
  joinDate?: string
  supervisor?: {
    id: string
    name: string
  }
  reports: {
    id: string
    name: string
    region: string
    mappingType: string
  }[]
}

// Make sure we're importing the type where needed
export type { EmployeeWithMappings, EmployeeDetails }
