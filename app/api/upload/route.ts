import { type NextRequest, NextResponse } from "next/server"

// Define expected headers for each file type
const expectedHeaders = {
  travel: ["employee_id", "destination", "departure_date", "return_date", "purpose", "cost"],
  donations: ["employee_id", "charity_name", "donation_date", "amount", "matched"],
  meetings: ["employee_id", "meeting_date", "duration", "attendees", "purpose", "location"],
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const fileType = formData.get("fileType") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!fileType || !Object.keys(expectedHeaders).includes(fileType)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Read the file content
    const text = await file.text()
    const lines = text.split("\n")

    if (lines.length === 0) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 })
    }

    // Validate headers
    const headers = lines[0]
      .toLowerCase()
      .split(",")
      .map((h) => h.trim())
    const requiredHeaders = expectedHeaders[fileType as keyof typeof expectedHeaders]
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))

    if (missingHeaders.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required headers",
          missingHeaders,
        },
        { status: 400 },
      )
    }

    // Process the file (in a real app, this would save to database, etc.)
    // For this example, we'll just return success

    return NextResponse.json({
      success: true,
      message: "File uploaded and processed successfully",
      rowCount: lines.length - 1, // Excluding header row
    })
  } catch (error) {
    console.error("Error processing upload:", error)
    return NextResponse.json(
      {
        error: "Failed to process upload",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
