import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Report } from "@/lib/types"
import { MapPin, User } from "lucide-react"
import EmployeeDetailsDialog from "@/components/employee-details-dialog"

interface ReportDetailsProps {
  report: Report
}

export default function ReportDetails({ report }: ReportDetailsProps) {
  const getMappingTypeLabel = (type: string) => {
    switch (type) {
      case "employeeId":
        return "Employee ID"
      case "teamId":
        return "Team ID"
      case "areaId":
        return "Area ID"
      case "cityId":
        return "City ID"
      case "countryId":
        return "Country ID"
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Report Name</h3>
          <p className="text-lg font-semibold">{report.name}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Region</h3>
          <Badge variant="outline" className="text-sm font-medium">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {report.region}
          </Badge>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Supervisors</h3>
        {report.supervisors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {report.supervisors.map((supervisor) => (
              <Card key={supervisor} className="bg-muted/50">
                <CardContent className="p-3 flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    Employee ID: <EmployeeDetailsDialog employeeId={supervisor} />
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No supervisors assigned</p>
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Mapping Criteria</h3>
        {report.mappings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {report.mappings.map((mapping, index) => (
              <Card key={index} className="bg-muted/50">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{getMappingTypeLabel(mapping.type)}</span>
                    <Badge variant="secondary" className="ml-2">
                      {mapping.value}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No mapping criteria defined</p>
        )}
      </div>
    </div>
  )
}
