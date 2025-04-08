import { Database } from "sqlite3"
import { open } from "sqlite"
import type { Report, Employee } from "./types"

// Initialize database connection
async function openDb() {
  return open({
    filename: process.env.DATABASE_PATH || "./database.sqlite",
    driver: Database,
  })
}

// Fetch all reports from the database
export async function getReports(): Promise<Report[]> {
  const db = await openDb()

  try {
    const reports = await db.all(`
      SELECT * FROM reports
    `)

    // Process the reports to match our application structure
    const formattedReports: Report[] = await Promise.all(
      reports.map(async (report) => {
        // Get mappings for this report
        const mappings = await db.all(
          `
          SELECT mapping_type as type, mapping_id as value, inclusion_flag as include
          FROM mappings
          WHERE report_name = ?
        `,
          [report.report_name],
        )

        // Format supervisors (assuming they're stored as comma-separated values)
        const supervisors = report.report_supervisors ? report.report_supervisors.split(",").map((id) => id.trim()) : []

        return {
          id: report.rowid.toString(),
          name: report.report_name,
          region: report.report_region,
          supervisors,
          mappings: mappings
            .filter((mapping) => mapping.include === "Yes")
            .map((mapping) => ({
              type: mapping.type.toLowerCase().replace(/id$/, "Id"),
              value: mapping.value,
            })),
        }
      }),
    )

    return formattedReports
  } finally {
    await db.close()
  }
}

// Fetch all employees from the database
export async function getEmployees(): Promise<Employee[]> {
  const db = await openDb()

  try {
    const employees = await db.all(`
      SELECT * FROM employees
    `)

    // Format the employee data to match our application structure
    return employees.map((emp) => ({
      id: emp.employee_id,
      name: emp.employee_name,
      teamId: emp.team_id,
      teamName: emp.team_name,
      areaId: emp.area_id,
      cityId: emp.city_id,
      countryId: emp.country_id,
      location: `${emp.city_name || ""}, ${emp.country_name || ""}`.trim().replace(/^,\s*/, ""),
    }))
  } finally {
    await db.close()
  }
}

// Get employees that match a specific report's mapping criteria
export async function getMatchingEmployees(reportName: string): Promise<Employee[]> {
  const db = await openDb()

  try {
    // Get all mappings for this report with inclusion flag = 'Yes'
    const mappings = await db.all(
      `
      SELECT mapping_type as type, mapping_id as value
      FROM mappings
      WHERE report_name = ? AND inclusion_flag = 'Yes'
    `,
      [reportName],
    )

    if (mappings.length === 0) {
      return []
    }

    // Build a dynamic SQL query based on the mapping types
    const conditions = []
    const params = []

    for (const mapping of mappings) {
      const columnName = mapping.type.toLowerCase()
      conditions.push(`${columnName} = ?`)
      params.push(mapping.value)
    }

    const query = `
      SELECT * FROM employees
      WHERE ${conditions.join(" OR ")}
    `

    const employees = await db.all(query, params)

    // Format the employee data
    return employees.map((emp) => ({
      id: emp.employee_id,
      name: emp.employee_name,
      teamId: emp.team_id,
      teamName: emp.team_name,
      areaId: emp.area_id,
      cityId: emp.city_id,
      countryId: emp.country_id,
      location: `${emp.city_name || ""}, ${emp.country_name || ""}`.trim().replace(/^,\s*/, ""),
    }))
  } finally {
    await db.close()
  }
}
