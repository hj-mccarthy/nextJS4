import type { Report, Employee, EmployeeWithMappings, EmployeeDetails } from "./types"
import {
  reportsData,
  employeesData,
  incompleteMappingsData,
  mappingsData,
  employeeMappingsData,
  type EmployeeMapping,
} from "./sample-data"
import { uploadHistoryData } from "./upload-history-data"

// Fetch reports from the sample data
export async function fetchReports(): Promise<Report[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return reportsData
}

// Fetch all employees from the sample data
export async function fetchEmployees(): Promise<Employee[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return employeesData
}

// Fetch employees that match a specific report
export async function fetchMatchingEmployees(reportName: string): Promise<Employee[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Find the report
  const report = reportsData.find((r) => r.name === reportName)
  if (!report) return []

  // Get all employees that match the report's mappings
  return employeesData.filter((employee) => {
    return report.mappings.some((mapping) => {
      switch (mapping.type) {
        case "employeeId":
          return mapping.value === employee.id
        case "teamId":
          return mapping.value === employee.teamId
        case "areaId":
          return mapping.value === employee.areaId
        case "cityId":
          return mapping.value === employee.cityId
        case "countryId":
          return mapping.value === employee.countryId
        default:
          return false
      }
    })
  })
}

// Fetch employees with incomplete mappings
export async function fetchIncompleteMappings(): Promise<EmployeeWithMappings[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return incompleteMappingsData
}

// Fetch active mappings for Excel export
export async function fetchActiveMappings() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mappingsData.filter((mapping) => mapping.active_flag === "Y")
}

// Fetch employee mappings for a specific report
export async function fetchEmployeeMappings(reportName: string): Promise<EmployeeMapping[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return employeeMappingsData.filter((mapping) => mapping.reportName === reportName)
}

// Update inclusion flag for an employee mapping
export async function updateInclusionFlag(mappingId: string, inclusionFlag: "Yes" | "No"): Promise<EmployeeMapping> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Find the mapping in the sample data
  const mappingIndex = employeeMappingsData.findIndex((m) => m.id === mappingId)

  if (mappingIndex === -1) {
    throw new Error("Mapping not found")
  }

  // Update the inclusion flag
  employeeMappingsData[mappingIndex].inclusionFlag = inclusionFlag

  // Return the updated mapping
  return employeeMappingsData[mappingIndex]
}

// Save all mapping changes
export async function saveMappingChanges(mappings: EmployeeMapping[]): Promise<boolean> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Update all mappings in the sample data
  mappings.forEach((updatedMapping) => {
    const index = employeeMappingsData.findIndex((m) => m.id === updatedMapping.id)
    if (index !== -1) {
      employeeMappingsData[index] = updatedMapping
    }
  })

  return true
}

// Check if an employee is mapped to a report
export function isEmployeeMappedToReport(employeeId: string, reportName: string): boolean {
  return employeeMappingsData.some(
    (mapping) =>
      mapping.employeeId === employeeId && mapping.reportName === reportName && mapping.inclusionFlag === "Yes",
  )
}

// Get all employees in a supervisor's org chart
export function getOrgChartData(supervisorIds: string[]): Employee[] {
  // Start with the supervisors
  const supervisors = employeesData.filter((emp) => supervisorIds.includes(emp.id))

  // Function to recursively get all reports
  const getAllReports = (managerId: string): Employee[] => {
    const directReports = employeesData.filter((emp) => emp.supervisorId === managerId)
    let allReports: Employee[] = [...directReports]

    // Recursively get reports of reports
    directReports.forEach((report) => {
      allReports = [...allReports, ...getAllReports(report.id)]
    })

    return allReports
  }

  // Get all employees in the org chart
  let orgChart: Employee[] = [...supervisors]
  supervisors.forEach((supervisor) => {
    orgChart = [...orgChart, ...getAllReports(supervisor.id)]
  })

  // Remove duplicates
  return Array.from(new Map(orgChart.map((emp) => [emp.id, emp])).values())
}

// Fetch upload history for a specific file type
export async function fetchUploadHistory(fileType: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Filter history by file type
  return uploadHistoryData.filter((item) => item.fileType === fileType)
}

// Fetch detailed employee information including mapped reports
export async function fetchEmployeeDetails(employeeId: string): Promise<EmployeeDetails | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Find the employee
  const employee = employeesData.find((emp) => emp.id === employeeId)
  if (!employee) return null

  // Find supervisor if exists
  const supervisor = employee.supervisorId ? employeesData.find((emp) => emp.id === employee.supervisorId) : null

  // Find reports this employee is mapped to
  const mappedReports = employeeMappingsData
    .filter((mapping) => mapping.employeeId === employeeId && mapping.inclusionFlag === "Yes")
    .map((mapping) => {
      const report = reportsData.find((r) => r.name === mapping.reportName)
      return report
        ? {
            id: report.id,
            name: report.name,
            region: report.region,
            mappingType: mapping.mappingType,
          }
        : null
    })
    .filter((report): report is NonNullable<typeof report> => report !== null)

  // Generate sample contact info
  const email = `${employee.name.toLowerCase().replace(/\s+/g, ".")}@company.com`
  const phone = `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${
    Math.floor(Math.random() * 9000) + 1000
  }`
  const joinDate = new Date(Date.now() - Math.floor(Math.random() * 5 * 365 * 24 * 60 * 60 * 1000))
    .toISOString()
    .split("T")[0]

  return {
    ...employee,
    email,
    phone,
    joinDate,
    supervisor: supervisor
      ? {
          id: supervisor.id,
          name: supervisor.name,
        }
      : undefined,
    reports: mappedReports,
  }
}

// Find report by ID
export async function findReportById(reportId: string): Promise<Report | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return reportsData.find((report) => report.id === reportId) || null
}
