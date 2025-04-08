import type { Report, Employee, EmployeeWithMappings } from "./types"

// Sample reports data
export const reportsData: Report[] = [
  {
    id: "report-1",
    name: "Q1 Sales Performance",
    region: "AMER",
    supervisors: ["emp-101", "emp-102"],
    mappings: [
      { type: "teamId", value: "team-sales" },
      { type: "countryId", value: "usa" },
    ],
  },
  {
    id: "report-2",
    name: "European Marketing Metrics",
    region: "EMEA",
    supervisors: ["emp-203"],
    mappings: [
      { type: "teamId", value: "team-marketing" },
      { type: "areaId", value: "area-europe" },
    ],
  },
  {
    id: "report-3",
    name: "APAC Customer Support",
    region: "APAC",
    supervisors: ["emp-304", "emp-305"],
    mappings: [
      { type: "teamId", value: "team-support" },
      { type: "areaId", value: "area-apac" },
    ],
  },
  {
    id: "report-4",
    name: "Global Executive Summary",
    region: "AMER",
    supervisors: ["emp-101", "emp-203", "emp-304"],
    mappings: [
      { type: "employeeId", value: "emp-101" },
      { type: "employeeId", value: "emp-203" },
      { type: "employeeId", value: "emp-304" },
      { type: "employeeId", value: "emp-401" },
    ],
  },
  {
    id: "report-5",
    name: "New York Office Performance",
    region: "AMER",
    supervisors: ["emp-102"],
    mappings: [{ type: "cityId", value: "nyc" }],
  },
  {
    id: "report-6",
    name: "London Team Analysis",
    region: "EMEA",
    supervisors: ["emp-203"],
    mappings: [{ type: "cityId", value: "london" }],
  },
  {
    id: "report-7",
    name: "Tokyo Office Metrics",
    region: "APAC",
    supervisors: ["emp-305"],
    mappings: [{ type: "cityId", value: "tokyo" }],
  },
]

// Sample employees data with supervisor information
export const employeesData: Employee[] = [
  {
    id: "emp-101",
    name: "John Smith",
    teamId: "team-sales",
    teamName: "Sales",
    areaId: "area-north-america",
    cityId: "nyc",
    cityName: "New York",
    countryId: "usa",
    countryName: "USA",
    location: "New York, USA",
    supervisorId: "emp-401", // Reports to Noah Garcia (Executive)
    title: "Sales Director",
  },
  {
    id: "emp-102",
    name: "Sarah Johnson",
    teamId: "team-sales",
    teamName: "Sales",
    areaId: "area-north-america",
    cityId: "sf",
    cityName: "San Francisco",
    countryId: "usa",
    countryName: "USA",
    location: "San Francisco, USA",
    supervisorId: "emp-101", // Reports to John Smith
    title: "Sales Manager",
  },
  {
    id: "emp-103",
    name: "Michael Brown",
    teamId: "team-marketing",
    teamName: "Marketing",
    areaId: "area-north-america",
    cityId: "nyc",
    cityName: "New York",
    countryId: "usa",
    countryName: "USA",
    location: "New York, USA",
    supervisorId: "emp-102", // Reports to Sarah Johnson
    title: "Marketing Specialist",
  },
  {
    id: "emp-104",
    name: "Emily Davis",
    teamId: "team-support",
    teamName: "Customer Support",
    areaId: "area-north-america",
    cityId: "nyc",
    cityName: "New York",
    countryId: "usa",
    countryName: "USA",
    location: "New York, USA",
    supervisorId: "emp-102", // Reports to Sarah Johnson
    title: "Support Lead",
  },
  {
    id: "emp-201",
    name: "James Wilson",
    teamId: "team-sales",
    teamName: "Sales",
    areaId: "area-europe",
    cityId: "london",
    cityName: "London",
    countryId: "uk",
    countryName: "UK",
    location: "London, UK",
    supervisorId: "emp-101", // Reports to John Smith
    title: "Sales Manager",
  },
  {
    id: "emp-202",
    name: "Emma Taylor",
    teamId: "team-sales",
    teamName: "Sales",
    areaId: "area-europe",
    cityId: "paris",
    cityName: "Paris",
    countryId: "france",
    countryName: "France",
    location: "Paris, France",
    supervisorId: "emp-201", // Reports to James Wilson
    title: "Sales Representative",
  },
  {
    id: "emp-203",
    name: "Daniel Martinez",
    teamId: "team-marketing",
    teamName: "Marketing",
    areaId: "area-europe",
    cityId: "london",
    cityName: "London",
    countryId: "uk",
    countryName: "UK",
    location: "London, UK",
    supervisorId: "emp-401", // Reports to Noah Garcia (Executive)
    title: "Marketing Director",
  },
  {
    id: "emp-301",
    name: "Sophia Chen",
    teamId: "team-sales",
    teamName: "Sales",
    areaId: "area-apac",
    cityId: "tokyo",
    cityName: "Tokyo",
    countryId: "japan",
    countryName: "Japan",
    location: "Tokyo, Japan",
    supervisorId: "emp-101", // Reports to John Smith
    title: "Sales Manager",
  },
  {
    id: "emp-302",
    name: "William Kim",
    teamId: "team-sales",
    teamName: "Sales",
    areaId: "area-apac",
    cityId: "singapore",
    cityName: "Singapore",
    countryId: "singapore",
    countryName: "Singapore",
    location: "Singapore",
    supervisorId: "emp-301", // Reports to Sophia Chen
    title: "Sales Representative",
  },
  {
    id: "emp-303",
    name: "Olivia Wang",
    teamId: "team-marketing",
    teamName: "Marketing",
    areaId: "area-apac",
    cityId: "sydney",
    cityName: "Sydney",
    countryId: "australia",
    countryName: "Australia",
    location: "Sydney, Australia",
    supervisorId: "emp-203", // Reports to Daniel Martinez
    title: "Marketing Specialist",
  },
  {
    id: "emp-304",
    name: "Ethan Tanaka",
    teamId: "team-support",
    teamName: "Customer Support",
    areaId: "area-apac",
    cityId: "tokyo",
    cityName: "Tokyo",
    countryId: "japan",
    countryName: "Japan",
    location: "Tokyo, Japan",
    supervisorId: "emp-401", // Reports to Noah Garcia (Executive)
    title: "Support Director",
  },
  {
    id: "emp-305",
    name: "Ava Patel",
    teamId: "team-support",
    teamName: "Customer Support",
    areaId: "area-apac",
    cityId: "singapore",
    cityName: "Singapore",
    countryId: "singapore",
    countryName: "Singapore",
    location: "Singapore",
    supervisorId: "emp-304", // Reports to Ethan Tanaka
    title: "Support Manager",
  },
  {
    id: "emp-401",
    name: "Noah Garcia",
    teamId: "team-executive",
    teamName: "Executive",
    areaId: "area-global",
    cityId: "nyc",
    cityName: "New York",
    countryId: "usa",
    countryName: "USA",
    location: "New York, USA",
    supervisorId: null, // CEO, no supervisor
    title: "Chief Executive Officer",
  },
]

// Sample mappings data with active_flag and inclusion_flag
export interface MappingRecord {
  id: string
  report_name: string
  mapping_type: string
  mapping_id: string
  inclusion_flag: "Yes" | "No"
  active_flag: "Y" | "N"
}

export const mappingsData: MappingRecord[] = [
  {
    id: "map-1",
    report_name: "Q1 Sales Performance",
    mapping_type: "team_id",
    mapping_id: "team-sales",
    inclusion_flag: "Yes",
    active_flag: "Y",
  },
  {
    id: "map-2",
    report_name: "Q1 Sales Performance",
    mapping_type: "country_id",
    mapping_id: "usa",
    inclusion_flag: "Yes",
    active_flag: "Y",
  },
  {
    id: "map-3",
    report_name: "European Marketing Metrics",
    mapping_type: "team_id",
    mapping_id: "team-marketing",
    inclusion_flag: "Yes",
    active_flag: "Y",
  },
  {
    id: "map-4",
    report_name: "European Marketing Metrics",
    mapping_type: "area_id",
    mapping_id: "area-europe",
    inclusion_flag: "Yes",
    active_flag: "Y",
  },
  {
    id: "map-5",
    report_name: "APAC Customer Support",
    mapping_type: "team_id",
    mapping_id: "team-support",
    inclusion_flag: "Yes",
    active_flag: "Y",
  },
  {
    id: "map-6",
    report_name: "APAC Customer Support",
    mapping_type: "area_id",
    mapping_id: "area-apac",
    inclusion_flag: "Yes",
    active_flag: "Y",
  },
  {
    id: "map-7",
    report_name: "Global Executive Summary",
    mapping_type: "employee_id",
    mapping_id: "emp-101",
    inclusion_flag: "Yes",
    active_flag: "Y",
  },
  {
    id: "map-8",
    report_name: "Global Executive Summary",
    mapping_type: "employee_id",
    mapping_id: "emp-203",
    inclusion_flag: "Yes",
    active_flag: "Y",
  },
  {
    id: "map-9",
    report_name: "Global Executive Summary",
    mapping_type: "employee_id",
    mapping_id: "emp-304",
    inclusion_flag: "Yes",
    active_flag: "Y",
  },
  {
    id: "map-10",
    report_name: "Global Executive Summary",
    mapping_type: "employee_id",
    mapping_id: "emp-401",
    inclusion_flag: "Yes",
    active_flag: "Y",
  },
  {
    id: "map-11",
    report_name: "New York Office Performance",
    mapping_type: "city_id",
    mapping_id: "nyc",
    inclusion_flag: "Yes",
    active_flag: "Y",
  },
  {
    id: "map-12",
    report_name: "London Team Analysis",
    mapping_type: "city_id",
    mapping_id: "london",
    inclusion_flag: "Yes",
    active_flag: "Y",
  },
  {
    id: "map-13",
    report_name: "Tokyo Office Metrics",
    mapping_type: "city_id",
    mapping_id: "tokyo",
    inclusion_flag: "Yes",
    active_flag: "Y",
  },
  // Some inactive mappings
  {
    id: "map-14",
    report_name: "Q1 Sales Performance",
    mapping_type: "employee_id",
    mapping_id: "emp-105",
    inclusion_flag: "No",
    active_flag: "N",
  },
  {
    id: "map-15",
    report_name: "European Marketing Metrics",
    mapping_type: "country_id",
    mapping_id: "germany",
    inclusion_flag: "No",
    active_flag: "N",
  },
  {
    id: "map-16",
    report_name: "APAC Customer Support",
    mapping_type: "employee_id",
    mapping_id: "emp-306",
    inclusion_flag: "No",
    active_flag: "N",
  },
  // Some mappings with inclusion_flag = "No" but active_flag = "Y"
  {
    id: "map-17",
    report_name: "Q1 Sales Performance",
    mapping_type: "area_id",
    mapping_id: "area-north-america",
    inclusion_flag: "No",
    active_flag: "Y",
  },
  {
    id: "map-18",
    report_name: "European Marketing Metrics",
    mapping_type: "city_id",
    mapping_id: "london",
    inclusion_flag: "No",
    active_flag: "Y",
  },
  {
    id: "map-19",
    report_name: "APAC Customer Support",
    mapping_type: "country_id",
    mapping_id: "japan",
    inclusion_flag: "No",
    active_flag: "Y",
  },
  {
    id: "map-20",
    report_name: "Global Executive Summary",
    mapping_type: "team_id",
    mapping_id: "team-executive",
    inclusion_flag: "No",
    active_flag: "Y",
  },
]

// Sample employee mappings data for the table
export interface EmployeeMapping {
  id: string
  employeeId: string
  employeeName: string
  reportName: string
  mappingType: string
  mappingValue: string
  inclusionFlag: "Yes" | "No"
}

// Generate employee mappings data based on employees and mappings
export const employeeMappingsData: EmployeeMapping[] = [
  // Q1 Sales Performance - team-sales
  {
    id: "em-1",
    employeeId: "emp-101",
    employeeName: "John Smith",
    reportName: "Q1 Sales Performance",
    mappingType: "teamId",
    mappingValue: "team-sales",
    inclusionFlag: "Yes",
  },
  {
    id: "em-2",
    employeeId: "emp-102",
    employeeName: "Sarah Johnson",
    reportName: "Q1 Sales Performance",
    mappingType: "teamId",
    mappingValue: "team-sales",
    inclusionFlag: "Yes",
  },
  {
    id: "em-3",
    employeeId: "emp-201",
    employeeName: "James Wilson",
    reportName: "Q1 Sales Performance",
    mappingType: "teamId",
    mappingValue: "team-sales",
    inclusionFlag: "Yes",
  },

  // Q1 Sales Performance - usa
  {
    id: "em-4",
    employeeId: "emp-101",
    employeeName: "John Smith",
    reportName: "Q1 Sales Performance",
    mappingType: "countryId",
    mappingValue: "usa",
    inclusionFlag: "Yes",
  },
  {
    id: "em-5",
    employeeId: "emp-102",
    employeeName: "Sarah Johnson",
    reportName: "Q1 Sales Performance",
    mappingType: "countryId",
    mappingValue: "usa",
    inclusionFlag: "Yes",
  },
  {
    id: "em-6",
    employeeId: "emp-103",
    employeeName: "Michael Brown",
    reportName: "Q1 Sales Performance",
    mappingType: "countryId",
    mappingValue: "usa",
    inclusionFlag: "No",
  },

  // European Marketing Metrics - team-marketing
  {
    id: "em-7",
    employeeId: "emp-103",
    employeeName: "Michael Brown",
    reportName: "European Marketing Metrics",
    mappingType: "teamId",
    mappingValue: "team-marketing",
    inclusionFlag: "Yes",
  },
  {
    id: "em-8",
    employeeId: "emp-203",
    employeeName: "Daniel Martinez",
    reportName: "European Marketing Metrics",
    mappingType: "teamId",
    mappingValue: "team-marketing",
    inclusionFlag: "Yes",
  },

  // APAC Customer Support - team-support
  {
    id: "em-9",
    employeeId: "emp-104",
    employeeName: "Emily Davis",
    reportName: "APAC Customer Support",
    mappingType: "teamId",
    mappingValue: "team-support",
    inclusionFlag: "Yes",
  },
  {
    id: "em-10",
    employeeId: "emp-304",
    employeeName: "Ethan Tanaka",
    reportName: "APAC Customer Support",
    mappingType: "teamId",
    mappingValue: "team-support",
    inclusionFlag: "Yes",
  },
  {
    id: "em-11",
    employeeId: "emp-305",
    employeeName: "Ava Patel",
    reportName: "APAC Customer Support",
    mappingType: "teamId",
    mappingValue: "team-support",
    inclusionFlag: "No",
  },

  // Global Executive Summary - employee mappings
  {
    id: "em-12",
    employeeId: "emp-101",
    employeeName: "John Smith",
    reportName: "Global Executive Summary",
    mappingType: "employeeId",
    mappingValue: "emp-101",
    inclusionFlag: "Yes",
  },
  {
    id: "em-13",
    employeeId: "emp-203",
    employeeName: "Daniel Martinez",
    reportName: "Global Executive Summary",
    mappingType: "employeeId",
    mappingValue: "emp-203",
    inclusionFlag: "Yes",
  },
  {
    id: "em-14",
    employeeId: "emp-304",
    employeeName: "Ethan Tanaka",
    reportName: "Global Executive Summary",
    mappingType: "employeeId",
    mappingValue: "emp-304",
    inclusionFlag: "Yes",
  },
  {
    id: "em-15",
    employeeId: "emp-401",
    employeeName: "Noah Garcia",
    reportName: "Global Executive Summary",
    mappingType: "employeeId",
    mappingValue: "emp-401",
    inclusionFlag: "No",
  },
]

// Sample incomplete mappings data
export const incompleteMappingsData: EmployeeWithMappings[] = [
  {
    ...employeesData[2], // Michael Brown
    report_count: 0,
    mapped_reports: null,
  },
  {
    ...employeesData[3], // Emily Davis
    report_count: 1,
    mapped_reports: "APAC Customer Support",
  },
  {
    ...employeesData[5], // Emma Taylor
    report_count: 1,
    mapped_reports: "European Marketing Metrics",
  },
  {
    ...employeesData[8], // William Kim
    report_count: 0,
    mapped_reports: null,
  },
  {
    ...employeesData[9], // Olivia Wang
    report_count: 1,
    mapped_reports: "European Marketing Metrics",
  },
]
