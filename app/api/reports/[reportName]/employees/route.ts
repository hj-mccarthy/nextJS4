import { NextResponse } from "next/server"
import { reportsData, employeesData } from "@/lib/sample-data"

export async function GET(request: Request, { params }: { params: { reportName: string } }) {
  try {
    const reportName = params.reportName
    if (!reportName) {
      return NextResponse.json({ error: "Report name is required" }, { status: 400 })
    }

    // Find the report in sample data
    const report = reportsData.find((r) => r.name === reportName)
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    // Get matching employees
    const matchingEmployees = employeesData.filter((employee) => {
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

    return NextResponse.json(matchingEmployees)
  } catch (error) {
    console.error("Error fetching matching employees:", error)
    return NextResponse.json({ error: "Failed to fetch matching employees" }, { status: 500 })
  }
}
