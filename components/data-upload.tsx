"use client"

import { useState, useRef, type ChangeEvent, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertCircle, Upload, FileText, TableIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import UploadHistory from "@/components/upload-history"
import CsvPreview from "@/components/csv-preview"
import { fetchUploadHistory } from "@/lib/data"

// Define expected headers for each file type
const expectedHeaders = {
  travel: ["employee_id", "destination", "departure_date", "return_date", "purpose", "cost"],
  donations: ["employee_id", "charity_name", "donation_date", "amount", "matched"],
  meetings: ["employee_id", "meeting_date", "duration", "attendees", "purpose", "location"],
}

type FileType = "travel" | "donations" | "meetings"

export default function DataUpload() {
  const [selectedFileType, setSelectedFileType] = useState<FileType>("travel")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [validationStatus, setValidationStatus] = useState<"idle" | "validating" | "valid" | "invalid">("idle")
  const [validationMessage, setValidationMessage] = useState("")
  const [missingHeaders, setMissingHeaders] = useState<string[]>([])
  const [uploadHistory, setUploadHistory] = useState<any[]>([])
  const [csvData, setCsvData] = useState<{ headers: string[]; rows: string[][] } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Load upload history for travel on initial render
  useEffect(() => {
    const loadInitialHistory = async () => {
      const history = await fetchUploadHistory("travel")
      setUploadHistory(history)
    }

    loadInitialHistory()
  }, [])

  const handleFileTypeChange = async (value: string) => {
    setSelectedFileType(value as FileType)
    resetUploadState()

    // Fetch upload history for the selected file type
    if (value) {
      const history = await fetchUploadHistory(value as FileType)
      setUploadHistory(history)
    } else {
      setUploadHistory([])
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)

    if (selectedFile && selectedFileType) {
      validateFile(selectedFile)
    } else {
      resetValidationState()
    }
  }

  const parseCsvData = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "")

    if (lines.length === 0) return null

    const headers = lines[0].split(",").map((h) => h.trim())

    // Get all rows of data (not just 20)
    const rows = lines.slice(1).map((line) => line.split(",").map((cell) => cell.trim()))

    return { headers, rows }
  }

  const validateFile = async (file: File) => {
    if (!selectedFileType) {
      setValidationStatus("invalid")
      setValidationMessage("Please select a file type first")
      return
    }

    if (!file.name.endsWith(".csv")) {
      setValidationStatus("invalid")
      setValidationMessage("Only CSV files are supported")
      return
    }

    setValidationStatus("validating")
    setValidationMessage("Validating file headers...")

    try {
      const text = await file.text()
      const lines = text.split("\n")

      if (lines.length === 0) {
        setValidationStatus("invalid")
        setValidationMessage("File is empty")
        return
      }

      const headers = lines[0]
        .toLowerCase()
        .split(",")
        .map((h) => h.trim())
      const requiredHeaders = expectedHeaders[selectedFileType]
      const missing = requiredHeaders.filter((h) => !headers.includes(h))

      if (missing.length > 0) {
        setValidationStatus("invalid")
        setValidationMessage(`Missing required headers`)
        setMissingHeaders(missing)
        setCsvData(null)
      } else {
        setValidationStatus("valid")
        setValidationMessage(`File validated successfully. Ready to upload.`)
        setMissingHeaders([])

        // Parse CSV data for preview
        setCsvData(parseCsvData(text))
      }
    } catch (error) {
      setValidationStatus("invalid")
      setValidationMessage("Error validating file: " + (error instanceof Error ? error.message : String(error)))
      setCsvData(null)
    }
  }

  const handleUpload = async () => {
    if (!file || !selectedFileType || validationStatus !== "valid") return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 10
        if (newProgress >= 100) {
          clearInterval(interval)

          // Simulate API call completion
          setTimeout(() => {
            setIsUploading(false)

            // Add the new upload to history
            const now = new Date()
            const newUpload = {
              id: `upload-${Date.now()}`,
              fileType: selectedFileType,
              fileName: file.name,
              uploadDate: now.toISOString(),
              month: now.toLocaleString("default", { month: "long", year: "numeric" }),
              recordCount: csvData
                ? csvData.rows.length + Math.floor(Math.random() * 100)
                : Math.floor(Math.random() * 500) + 50, // Use actual row count plus some random additional rows
              status: "Completed",
              uploadedBy: "Current User",
            }

            setUploadHistory((prev) => [newUpload, ...prev])

            toast({
              title: "Upload Complete",
              description: `${file.name} has been successfully uploaded and processed.`,
            })
            resetUploadState()
          }, 500)
        }
        return newProgress
      })
    }, 300)
  }

  const resetUploadState = () => {
    setFile(null)
    setIsUploading(false)
    setUploadProgress(0)
    resetValidationState()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const resetValidationState = () => {
    setValidationStatus("idle")
    setValidationMessage("")
    setMissingHeaders([])
    setCsvData(null)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Upload</CardTitle>
          <CardDescription>
            Upload CSV files to update employee data. Select the file type and ensure all required columns are present.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">File Type</label>
            <Select value={selectedFileType} onValueChange={handleFileTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select file type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="donations">Donations</SelectItem>
                <SelectItem value="meetings">Meetings</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedFileType && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Required Headers</label>
              <div className="flex flex-wrap gap-2">
                {expectedHeaders[selectedFileType].map((header) => (
                  <div key={header} className="bg-muted px-2 py-1 rounded text-xs">
                    {header}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="text-xs text-muted-foreground">CSV files only</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={isUploading || !selectedFileType}
                />
              </label>
            </div>

            {file && (
              <div className="flex items-center p-2 border rounded">
                <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium truncate flex-1">{file.name}</span>
                <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            )}

            {validationStatus === "valid" && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Validation Successful</AlertTitle>
                <AlertDescription className="text-green-700">{validationMessage}</AlertDescription>
              </Alert>
            )}

            {validationStatus === "invalid" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Validation Failed</AlertTitle>
                <AlertDescription>
                  {validationMessage}
                  {missingHeaders.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium">Missing headers:</p>
                      <ul className="list-disc pl-5 mt-1">
                        {missingHeaders.map((header) => (
                          <li key={header}>{header}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {csvData && validationStatus === "valid" && (
              <div className="space-y-4">
                <div className="flex items-center">
                  <TableIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Data Preview</h3>
                </div>
                <CsvPreview headers={csvData.headers} rows={csvData.rows} />
                <p className="text-xs text-muted-foreground text-center">
                  Showing preview of {csvData.rows.length} total rows
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={handleUpload}
                disabled={!file || validationStatus !== "valid" || isUploading}
                className="w-full sm:w-auto"
              >
                {isUploading ? "Uploading..." : "Upload File"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedFileType && <UploadHistory fileType={selectedFileType} uploadHistory={uploadHistory} />}
    </div>
  )
}
