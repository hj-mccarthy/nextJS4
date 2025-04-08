import { NextResponse } from "next/server"
import { incompleteMappingsData } from "@/lib/sample-data"

export async function GET() {
  try {
    // Return sample data instead of querying database
    return NextResponse.json(incompleteMappingsData)
  } catch (error) {
    console.error("Error fetching incomplete mappings:", error)
    return NextResponse.json({ error: "Failed to fetch incomplete mappings" }, { status: 500 })
  }
}
