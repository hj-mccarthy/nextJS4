import { NextResponse } from "next/server"
import { mappingsData, employeesData, employeeMappingsData } from "@/lib/sample-data"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { employeeId, reportName, mappingType, mappingValue } = body

    // Validate required fields
    if (!reportName || !mappingType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Handle two different POST scenarios:
    // 1. Adding a mapping for a specific employee
    // 2. Adding a mapping type/value to a report

    let mappingId, employee

    if (employeeId) {
      // Scenario 1: Adding a mapping for a specific employee
      // Find the employee
      employee = employeesData.find((emp) => emp.id === employeeId)
      if (!employee) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 })
      }

      // Get the mapping ID based on the mapping type
      switch (mappingType) {
        case "employee_id":
          mappingId = employee.id
          break
        case "team_id":
          mappingId = employee.teamId
          break
        case "area_id":
          mappingId = employee.areaId
          break
        case "city_id":
          mappingId = employee.cityId
          break
        case "country_id":
          mappingId = employee.countryId
          break
        default:
          return NextResponse.json({ error: "Invalid mapping type" }, { status: 400 })
      }
    } else if (mappingValue) {
      // Scenario 2: Adding a mapping type/value to a report
      mappingId = mappingValue

      // Find an employee with this mapping value to add to employee mappings
      const mappingTypeKey = mappingType.replace(/Id$/, "Id")
      employee = employeesData.find((emp) => emp[mappingTypeKey as keyof typeof emp] === mappingValue)
    } else {
      return NextResponse.json({ error: "Either employeeId or mappingValue is required" }, { status: 400 })
    }

    // Check if mapping already exists in mappingsData
    const existingMappingIndex = mappingsData.findIndex(
      (m) =>
        m.report_name === reportName &&
        m.mapping_type === mappingType.replace(/Id$/, "_id") &&
        m.mapping_id === mappingId,
    )

    if (existingMappingIndex >= 0) {
      // Update existing mapping
      mappingsData[existingMappingIndex].inclusion_flag = "Yes"
      mappingsData[existingMappingIndex].active_flag = "Y"
    } else {
      // Add new mapping
      const newMapping = {
        id: `map-${Date.now()}`,
        report_name: reportName,
        mapping_type: mappingType.replace(/Id$/, "_id"),
        mapping_id: mappingId,
        inclusion_flag: "Yes",
        active_flag: "Y",
      }
      mappingsData.push(newMapping)
    }

    // If we found an employee, add to employeeMappingsData
    if (employee) {
      // Check if employee mapping already exists
      const existingEmployeeMappingIndex = employeeMappingsData.findIndex(
        (m) =>
          m.reportName === reportName &&
          m.mappingType === mappingType &&
          m.mappingValue === mappingId &&
          m.employeeId === employee.id,
      )

      if (existingEmployeeMappingIndex === -1) {
        // Add new employee mapping
        const newEmployeeMapping = {
          id: `em-${Date.now()}`,
          employeeId: employee.id,
          employeeName: employee.name,
          reportName: reportName,
          mappingType: mappingType,
          mappingValue: mappingId,
          inclusionFlag: "Yes",
        }
        employeeMappingsData.push(newEmployeeMapping)
      } else {
        // Update existing employee mapping
        employeeMappingsData[existingEmployeeMappingIndex].inclusionFlag = "Yes"
      }
    }

    return NextResponse.json({
      success: true,
      message: "Mapping added successfully",
    })
  } catch (error) {
    console.error("Error adding mapping:", error)
    return NextResponse.json({ error: "Failed to add mapping" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Return active mappings
    const activeMappings = mappingsData.filter((mapping) => mapping.active_flag === "Y")
    return NextResponse.json(activeMappings)
  } catch (error) {
    console.error("Error fetching active mappings:", error)
    return NextResponse.json({ error: "Failed to fetch active mappings" }, { status: 500 })
  }
}
