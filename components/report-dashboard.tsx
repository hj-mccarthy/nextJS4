"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReportDetails from "@/components/report-details"
import EmployeeMappings from "@/components/employee-mappings"
import OrgChart from "@/components/org-chart"
import IncompleteMappings from "@/components/incomplete-mappings"
import DataUpload from "@/components/data-upload"
import { fetchReports, fetchMatchingEmployees, fetchIncompleteMappings } from "@/lib/data"
import type { Report, Employee } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

// Define a type for employees with mapping counts
export type EmployeeWithMappings = Employee & { reportCount: number }

export default function ReportDashboard() {
  const [reports, setReports] = useState<Report[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  // Update the state type for incompleteMappings
  const [incompleteMappings, setIncompleteMappings] = useState<EmployeeWithMappings[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("reports")

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [reportsData, incompleteMappingsData] = await Promise.all([fetchReports(), fetchIncompleteMappings()])

        setReports(reportsData)
        setFilteredReports(reportsData)
        setIncompleteMappings(incompleteMappingsData as EmployeeWithMappings[])

        // Set default selected report if available
        if (reportsData.length > 0) {
          setSelectedReport(reportsData[0])
        }
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Add a new useEffect to fetch employees when a report is selected
  useEffect(() => {
    if (selectedReport) {
      const loadEmployees = async () => {
        try {
          const matchedEmployees = await fetchMatchingEmployees(selectedReport.name)
          setEmployees(matchedEmployees)
        } catch (error) {
          console.error("Failed to load employees:", error)
        }
      }

      loadEmployees()
    }
  }, [selectedReport])

  // Filter reports when region changes
  useEffect(() => {
    if (selectedRegion === "all") {
      setFilteredReports(reports)
    } else {
      setFilteredReports(reports.filter((report) => report.region === selectedRegion))
    }

    // Update selected report if needed
    if (
      filteredReports.length > 0 &&
      (!selectedReport || (selectedRegion !== "all" && selectedReport.region !== selectedRegion))
    ) {
      setSelectedReport(filteredReports[0])
    }
  }, [selectedRegion, reports, selectedReport, filteredReports])

  // Handle region selection
  const handleRegionChange = (value: string) => {
    setSelectedRegion(value)
  }

  // Handle report selection
  const handleReportChange = (value: string) => {
    const report = reports.find((r) => r.id === value)
    if (report) {
      setSelectedReport(report)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading report data...</div>
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="incomplete">
          Incomplete Mappings
          {incompleteMappings.length > 0 && (
            <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
              {incompleteMappings.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="upload">Data Upload</TabsTrigger>
      </TabsList>

      <TabsContent value="reports" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Filter by Region</label>
            <Select value={selectedRegion} onValueChange={handleRegionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="AMER">AMER</SelectItem>
                <SelectItem value="EMEA">EMEA</SelectItem>
                <SelectItem value="APAC">APAC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select Report</label>
            <Select
              value={selectedReport?.id}
              onValueChange={handleReportChange}
              disabled={filteredReports.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select report" />
              </SelectTrigger>
              <SelectContent>
                {filteredReports.map((report) => (
                  <SelectItem key={report.id} value={report.id}>
                    {report.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedReport ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ReportDetails report={selectedReport} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Mapped Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <EmployeeMappings report={selectedReport} employees={employees} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organization Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <OrgChart report={selectedReport} />
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                {filteredReports.length === 0
                  ? "No reports found for the selected region"
                  : "Select a report to view details"}
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="incomplete">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Employees with Incomplete Mappings</h2>
              <p className="text-sm text-muted-foreground">Showing employees mapped to fewer than 2 reports</p>
            </div>
            <Badge variant="secondary" className="text-base">
              Total: {incompleteMappings.length}
            </Badge>
          </div>
          <IncompleteMappings employees={incompleteMappings} reports={reports} />
        </div>
      </TabsContent>

      <TabsContent value="upload">
        <DataUpload />
      </TabsContent>
    </Tabs>
  )
}
