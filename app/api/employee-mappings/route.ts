import { NextResponse } from "next/server"
import { employeeMappingsData } from "@/lib/sample-data"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const reportName = searchParams.get("reportName")

    if (!reportName) {
      return NextResponse.json({ error: "Report name is required" }, { status: 400 })
    }

    const mappings = employeeMappingsData.filter((mapping) => mapping.reportName === reportName)
    return NextResponse.json(mappings)
  } catch (error) {
    console.error("Error fetching employee mappings:", error)
    return NextResponse.json({ error: "Failed to fetch employee mappings" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { mappingId, inclusionFlag } = await request.json()

    if (!mappingId || !inclusionFlag) {
      return NextResponse.json({ error: "Mapping ID and inclusion flag are required" }, { status: 400 })
    }

    const mappingIndex = employeeMappingsData.findIndex((m) => m.id === mappingId)

    if (mappingIndex === -1) {
      return NextResponse.json({ error: "Mapping not found" }, { status: 404 })
    }

    // Update the inclusion flag
    employeeMappingsData[mappingIndex].inclusionFlag = inclusionFlag

    return NextResponse.json(employeeMappingsData[mappingIndex])
  } catch (error) {
    console.error("Error updating inclusion flag:", error)
    return NextResponse.json({ error: "Failed to update inclusion flag" }, { status: 500 })
  }
}
