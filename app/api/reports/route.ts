import { NextResponse } from "next/server"
import { reportsData } from "@/lib/sample-data"

export async function GET() {
  try {
    // Return sample data instead of querying database
    return NextResponse.json(reportsData)
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}
