"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, Plus, Search, User, Users, MapPin, Building } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { fetchEmployees } from "@/lib/data"
import type { Report, Employee } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddMappingDialogProps {
  report: Report
  onMappingAdded: () => void
}

type SearchCategory = "name" | "id" | "team" | "location" | "title"

export default function AddMappingDialog({ report, onMappingAdded }: AddMappingDialogProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchCategory, setSearchCategory] = useState<SearchCategory>("name")
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [mappingType, setMappingType] = useState<string>("employeeId")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch all employees when dialog opens
  useEffect(() => {
    if (open) {
      const loadEmployees = async () => {
        setIsLoading(true)
        try {
          const allEmployees = await fetchEmployees()
          setEmployees(allEmployees)
          setFilteredEmployees(allEmployees)
        } catch (error) {
          console.error("Failed to load employees:", error)
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load employees. Please try again.",
          })
        } finally {
          setIsLoading(false)
        }
      }

      loadEmployees()
    } else {
      // Reset state when dialog closes
      setSearchTerm("")
      setSearchCategory("name")
      setSelectedEmployee(null)
      setMappingType("employeeId")
    }
  }, [open, toast])

  // Filter employees based on search term and category
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEmployees(employees)
      return
    }

    const searchLower = searchTerm.toLowerCase()
    const filtered = employees.filter((employee) => {
      switch (searchCategory) {
        case "name":
          return employee.name.toLowerCase().includes(searchLower)
        case "id":
          return employee.id.toLowerCase().includes(searchLower)
        case "team":
          return employee.teamName.toLowerCase().includes(searchLower)
        case "location":
          return (
            employee.location.toLowerCase().includes(searchLower) ||
            employee.countryName.toLowerCase().includes(searchLower) ||
            employee.cityName.toLowerCase().includes(searchLower)
          )
        case "title":
          return employee.title && employee.title.toLowerCase().includes(searchLower)
      }
    })

    setFilteredEmployees(filtered)
  }, [searchTerm, searchCategory, employees])

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee)
  }

  const handleMappingTypeChange = (value: string) => {
    setMappingType(value)
  }

  const handleSubmit = async () => {
    if (!selectedEmployee || !mappingType) return

    setIsSubmitting(true)
    try {
      // Get the mapping value based on the mapping type
      let mappingValue = ""
      switch (mappingType) {
        case "employeeId":
          mappingValue = selectedEmployee.id
          break
        case "teamId":
          mappingValue = selectedEmployee.teamId
          break
        case "areaId":
          mappingValue = selectedEmployee.areaId
          break
        case "cityId":
          mappingValue = selectedEmployee.cityId
          break
        case "countryId":
          mappingValue = selectedEmployee.countryId
          break
      }

      // Call API to add mapping
      const response = await fetch("/api/mappings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportName: report.name,
          mappingType: mappingType,
          mappingValue: mappingValue,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to add mapping")
      }

      toast({
        title: "Mapping Added",
        description: `Successfully added ${getMappingTypeLabel(mappingType)} mapping to ${report.name}`,
      })

      onMappingAdded()
      setOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add mapping",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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

  const getMappingTypeIcon = (type: string) => {
    switch (type) {
      case "employeeId":
        return <User className="h-4 w-4" />
      case "teamId":
        return <Users className="h-4 w-4" />
      case "areaId":
      case "cityId":
      case "countryId":
        return <MapPin className="h-4 w-4" />
      default:
        return <Building className="h-4 w-4" />
    }
  }

  const getSearchPlaceholder = () => {
    switch (searchCategory) {
      case "name":
        return "Search by employee name..."
      case "id":
        return "Search by employee ID..."
      case "team":
        return "Search by team name..."
      case "location":
        return "Search by city or country..."
      case "title":
        return "Search by job title..."
      default:
        return "Search employees..."
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <Plus className="h-4 w-4 mr-1" /> Add Mapping
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add Mapping to {report.name}</DialogTitle>
          <DialogDescription>
            Search for an employee or team and select a mapping type to add to this report.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Search input with category dropdown */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Employees</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder={getSearchPlaceholder()}
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={searchCategory} onValueChange={(value) => setSearchCategory(value as SearchCategory)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Search by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="id">Employee ID</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="title">Job Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Employee list */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Select Employee or Team</Label>
              <span className="text-xs text-muted-foreground">
                {filteredEmployees.length} {filteredEmployees.length === 1 ? "result" : "results"}
              </span>
            </div>
            {isLoading ? (
              <div className="h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground">Loading employees...</p>
              </div>
            ) : filteredEmployees.length > 0 ? (
              <ScrollArea className="h-[200px] border rounded-md">
                <div className="p-1">
                  {filteredEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted transition-colors",
                        selectedEmployee?.id === employee.id && "bg-muted",
                      )}
                      onClick={() => handleEmployeeSelect(employee)}
                    >
                      <div className="flex items-start space-x-3">
                        <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-xs text-muted-foreground">ID: {employee.id}</div>
                          <div className="text-xs text-muted-foreground">
                            {employee.teamName} • {employee.location}
                            {employee.title && ` • ${employee.title}`}
                          </div>
                        </div>
                      </div>
                      {selectedEmployee?.id === employee.id && <Check className="h-4 w-4" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="h-[200px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">No employees found</p>
              </div>
            )}
          </div>

          {/* Mapping type selection */}
          {selectedEmployee && (
            <div className="space-y-2">
              <Label>Mapping Type</Label>
              <RadioGroup
                value={mappingType}
                onValueChange={handleMappingTypeChange}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="employeeId" id="employeeId" />
                  <Label htmlFor="employeeId" className="flex items-center">
                    <User className="h-3.5 w-3.5 mr-1.5" />
                    Employee ID
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="teamId" id="teamId" />
                  <Label htmlFor="teamId" className="flex items-center">
                    <Users className="h-3.5 w-3.5 mr-1.5" />
                    Team ID
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="areaId" id="areaId" />
                  <Label htmlFor="areaId" className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1.5" />
                    Area ID
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cityId" id="cityId" />
                  <Label htmlFor="cityId" className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1.5" />
                    City ID
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="countryId" id="countryId" />
                  <Label htmlFor="countryId" className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1.5" />
                    Country ID
                  </Label>
                </div>
              </RadioGroup>

              {/* Selected mapping value preview */}
              <div className="mt-4 p-3 bg-muted rounded-md">
                <div className="text-sm font-medium">Selected Mapping</div>
                <div className="flex items-center mt-1">
                  {getMappingTypeIcon(mappingType)}
                  <span className="ml-2">
                    {getMappingTypeLabel(mappingType)}:{" "}
                    <span className="font-medium">
                      {mappingType === "employeeId"
                        ? selectedEmployee.id
                        : mappingType === "teamId"
                          ? selectedEmployee.teamId
                          : mappingType === "areaId"
                            ? selectedEmployee.areaId
                            : mappingType === "cityId"
                              ? selectedEmployee.cityId
                              : selectedEmployee.countryId}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedEmployee || isSubmitting}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            {isSubmitting ? "Adding..." : "Add Mapping"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
