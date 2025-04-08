import { NextResponse } from "next/server"
import { mappingsData } from "@/lib/sample-data"

export async function GET() {
  try {
    // Filter active mappings
    const activeMappings = mappingsData.filter((mapping) => mapping.active_flag === "Y")
    return NextResponse.json(activeMappings)
  } catch (error) {
    console.error("Error exporting mappings:", error)
    return NextResponse.json({ error: "Failed to export mappings" }, { status: 500 })
  }
}
