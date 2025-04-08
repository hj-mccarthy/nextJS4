import { NextResponse } from "next/server"
import { employeesData } from "@/lib/sample-data"

export async function GET() {
  try {
    // Return sample data instead of querying database
    return NextResponse.json(employeesData)
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}
