"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Users, Building, MapPin, Briefcase, Mail, Phone, Calendar, FileText, ChevronRight } from "lucide-react"
import { fetchEmployeeDetails } from "@/lib/data"
import type { EmployeeDetails } from "@/lib/types"
import { cn } from "@/lib/utils"

interface EmployeeDetailsDialogProps {
  employeeId: string
  trigger?: React.ReactNode
  className?: string
}

export default function EmployeeDetailsDialog({ employeeId, trigger, className }: EmployeeDetailsDialogProps) {
  const [open, setOpen] = useState(false)
  const [employee, setEmployee] = useState<EmployeeDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (open && employeeId) {
      const loadEmployeeDetails = async () => {
        setLoading(true)
        try {
          const details = await fetchEmployeeDetails(employeeId)
          setEmployee(details)
        } catch (error) {
          console.error("Failed to load employee details:", error)
        } finally {
          setLoading(false)
        }
      }

      loadEmployeeDetails()
    }
  }, [open, employeeId])

  const handleReportClick = (reportId: string) => {
    setOpen(false)
    // Navigate to the report page
    router.push(`/?report=${reportId}`)
  }

  const defaultTrigger = (
    <Button variant="link" className={cn("p-0 h-auto font-medium", className)}>
      {employeeId}
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <p className="text-muted-foreground">Loading employee details...</p>
          </div>
        ) : employee ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">{employee.name}</DialogTitle>
              <DialogDescription>Employee ID: {employee.id}</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="details" className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Employee Details</TabsTrigger>
                <TabsTrigger value="reports">
                  Reports{" "}
                  <Badge variant="secondary" className="ml-2">
                    {employee.reports.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">Job Title</div>
                          <div>{employee.title || "Not specified"}</div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">Team</div>
                          <div>{employee.teamName}</div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">Reports To</div>
                          <div>
                            {employee.supervisor ? (
                              <EmployeeDetailsDialog
                                employeeId={employee.supervisor.id}
                                trigger={
                                  <Button variant="link" className="p-0 h-auto">
                                    {employee.supervisor.name}
                                  </Button>
                                }
                              />
                            ) : (
                              "None"
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">Location</div>
                          <div>
                            {employee.cityName}, {employee.countryName}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">Area</div>
                          <div>{employee.areaId}</div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">Joined</div>
                          <div>{employee.joinDate || "Not available"}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="text-sm font-medium mb-2">Contact Information</div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>{employee.email || "Email not available"}</div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>{employee.phone || "Phone not available"}</div>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    Employee ID: {employee.id}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="mt-4">
                <Card>
                  <CardContent className="p-0">
                    {employee.reports.length > 0 ? (
                      <ScrollArea className="h-[300px]">
                        <div className="divide-y">
                          {employee.reports.map((report) => (
                            <div
                              key={report.id}
                              className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                              onClick={() => handleReportClick(report.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{report.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    Region: {report.region} • Mapping Type: {report.mappingType}
                                  </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="p-6 text-center text-muted-foreground">
                        This employee is not mapped to any reports.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="py-12 flex items-center justify-center">
            <p className="text-muted-foreground">Employee not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
