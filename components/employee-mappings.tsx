"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Save } from "lucide-react"
import type { Report, Employee } from "@/lib/types"
import { fetchEmployeeMappings, saveMappingChanges } from "@/lib/data"
import type { EmployeeMapping } from "@/lib/sample-data"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import AddMappingDialog from "@/components/add-mapping-dialog"
import EmployeeDetailsDialog from "@/components/employee-details-dialog"

interface EmployeeMappingsProps {
  report: Report
  employees: Employee[]
}

export default function EmployeeMappings({ report, employees }: EmployeeMappingsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [mappings, setMappings] = useState<EmployeeMapping[]>([])
  const [originalMappings, setOriginalMappings] = useState<EmployeeMapping[]>([])
  const [loading, setLoading] = useState(true)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Fetch employee mappings when report changes
  useEffect(() => {
    const loadMappings = async () => {
      setLoading(true)
      try {
        const data = await fetchEmployeeMappings(report.name)
        setMappings(data)
        setOriginalMappings(JSON.parse(JSON.stringify(data))) // Deep copy
        setHasChanges(false)
      } catch (error) {
        console.error("Error loading employee mappings:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMappings()
  }, [report.name])

  // Filter mappings based on search term
  const filteredMappings = mappings.filter((mapping) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      mapping.employeeName.toLowerCase().includes(searchLower) ||
      mapping.employeeId.toLowerCase().includes(searchLower) ||
      mapping.mappingType.toLowerCase().includes(searchLower) ||
      mapping.mappingValue.toLowerCase().includes(searchLower)
    )
  })

  // Handle inclusion flag change
  const handleInclusionChange = async (mappingId: string, newValue: "Yes" | "No") => {
    // Update the mappings state with the updated mapping
    setMappings((prevMappings) =>
      prevMappings.map((mapping) => (mapping.id === mappingId ? { ...mapping, inclusionFlag: newValue } : mapping)),
    )

    // Check if there are any changes compared to original mappings
    const updatedMappings = mappings.map((mapping) =>
      mapping.id === mappingId ? { ...mapping, inclusionFlag: newValue } : mapping,
    )

    const hasAnyChanges = updatedMappings.some(
      (mapping, index) => mapping.inclusionFlag !== originalMappings[index]?.inclusionFlag,
    )

    setHasChanges(hasAnyChanges)
  }

  // Save all changes
  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      await saveMappingChanges(mappings)
      setOriginalMappings(JSON.parse(JSON.stringify(mappings))) // Update original mappings
      setHasChanges(false)

      toast({
        title: "Changes saved",
        description: "All mapping changes have been saved successfully.",
      })
    } catch (error) {
      console.error("Error saving changes:", error)
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Failed to save changes. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle new mapping added
  const handleMappingAdded = async () => {
    // Reload mappings to include the new one
    try {
      const data = await fetchEmployeeMappings(report.name)
      setMappings(data)
      setOriginalMappings(JSON.parse(JSON.stringify(data)))
      setHasChanges(false)
    } catch (error) {
      console.error("Error reloading mappings:", error)
    }
  }

  // Get the mapping type label
  const getMappingTypeLabel = (type: string) => {
    switch (type) {
      case "employeeId":
        return "Employee"
      case "teamId":
        return "Team"
      case "areaId":
        return "Area"
      case "cityId":
        return "City"
      case "countryId":
        return "Country"
      default:
        return type
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center border rounded-md px-3 py-2 flex-1 mr-4">
          <Search className="h-4 w-4 mr-2 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 p-0 shadow-none focus-visible:ring-0"
          />
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleSaveChanges} disabled={!hasChanges || isSaving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Updates"}
          </Button>
          <AddMappingDialog report={report} onMappingAdded={handleMappingAdded} />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>ID</TableHead>
              <TableHead className="hidden md:table-cell">Mapping Type</TableHead>
              <TableHead className="hidden md:table-cell">Value</TableHead>
              <TableHead>Inclusion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading employee mappings...
                </TableCell>
              </TableRow>
            ) : filteredMappings.length > 0 ? (
              filteredMappings.map((mapping) => (
                <TableRow
                  key={mapping.id}
                  className={cn(mapping.inclusionFlag === "Yes" ? "bg-green-50" : "bg-red-50")}
                >
                  <TableCell className="font-medium">
                    <EmployeeDetailsDialog
                      employeeId={mapping.employeeId}
                      trigger={
                        <Button variant="link" className="p-0 h-auto font-medium">
                          {mapping.employeeName}
                        </Button>
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <EmployeeDetailsDialog employeeId={mapping.employeeId} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{getMappingTypeLabel(mapping.mappingType)}</TableCell>
                  <TableCell className="hidden md:table-cell">{mapping.mappingValue}</TableCell>
                  <TableCell>
                    <Select
                      value={mapping.inclusionFlag}
                      onValueChange={(value) => handleInclusionChange(mapping.id, value as "Yes" | "No")}
                    >
                      <SelectTrigger className="h-8 w-[80px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {mappings.length === 0 ? "No employee mappings found" : "No results found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredMappings.length} of {mappings.length} mappings
      </div>
    </div>
  )
}
