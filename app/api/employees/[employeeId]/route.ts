import { NextResponse } from "next/server"
import { employeesData, employeeMappingsData } from "@/lib/sample-data"
import { reportsData } from "@/lib/sample-data"

export async function GET(request: Request, { params }: { params: { employeeId: string } }) {
  try {
    const employeeId = params.employeeId

    // Find the employee
    const employee = employeesData.find((emp) => emp.id === employeeId)
    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

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
      .filter((report) => report !== null)

    // Generate sample contact info
    const email = `${employee.name.toLowerCase().replace(/\s+/g, ".")}@company.com`
    const phone = `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
    const joinDate = new Date(Date.now() - Math.floor(Math.random() * 5 * 365 * 24 * 60 * 60 * 1000))
      .toISOString()
      .split("T")[0]

    return NextResponse.json({
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
    })
  } catch (error) {
    console.error("Error fetching employee details:", error)
    return NextResponse.json({ error: "Failed to fetch employee details" }, { status: 500 })
  }
}
