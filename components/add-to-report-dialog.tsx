"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import type { Report, Employee } from "@/lib/types"

interface AddToReportDialogProps {
  employee: Employee
  reports: Report[]
  onMappingAdded: (newCount: number) => void
}

export function AddToReportDialog({ employee, reports, onMappingAdded }: AddToReportDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [selectedReport, setSelectedReport] = React.useState<Report | null>(null)
  const [mappingType, setMappingType] = React.useState("employee_id")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!selectedReport) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/mappings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: employee.id,
          reportName: selectedReport.name,
          mappingType: mappingType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add mapping")
      }

      toast({
        title: "Mapping Added",
        description: `Successfully added ${employee.name} to ${selectedReport.name}`,
      })

      onMappingAdded(data.reportCount)
      setDialogOpen(false)
      setSelectedReport(null)
      setMappingType("employee_id")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Add to Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to Report</DialogTitle>
          <DialogDescription>
            Add {employee.name} to a report using their employee, team, or location information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Select Report</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                  {selectedReport ? `${selectedReport.name} (${selectedReport.region})` : "Select a report..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Search reports..." />
                  <CommandList>
                    <CommandEmpty>No reports found.</CommandEmpty>
                    <CommandGroup>
                      {reports.map((report) => (
                        <CommandItem
                          key={report.id}
                          value={report.name}
                          onSelect={() => {
                            setSelectedReport(report)
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedReport?.id === report.id ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {report.name}
                          <span className="ml-2 text-muted-foreground">({report.region})</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Mapping Type</Label>
            <RadioGroup value={mappingType} onValueChange={setMappingType} className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="employee_id" id="employee" />
                <Label htmlFor="employee">Employee ID</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="team_id" id="team" />
                <Label htmlFor="team">Team ID</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="area_id" id="area" />
                <Label htmlFor="area">Area ID</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="city_id" id="city" />
                <Label htmlFor="city">City ID</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="country_id" id="country" />
                <Label htmlFor="country">Country ID</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!selectedReport || isSubmitting}>
            {isSubmitting ? "Adding..." : "Add to Report"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
