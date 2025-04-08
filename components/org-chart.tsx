"use client"

import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { getOrgChartData, isEmployeeMappedToReport } from "@/lib/data"
import type { Report, Employee } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Users, ChevronDown, ChevronRight, User } from "lucide-react"
import EmployeeDetailsDialog from "@/components/employee-details-dialog"

interface OrgChartProps {
  report: Report
}

interface OrgNode {
  employee: Employee
  children: OrgNode[]
  expanded: boolean
}

export default function OrgChart({ report }: OrgChartProps) {
  const [orgData, setOrgData] = useState<OrgNode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const buildOrgChart = () => {
      setLoading(true)

      try {
        // Get all employees in the org chart
        const allEmployees = getOrgChartData(report.supervisors)

        // Build the org chart tree
        const buildTree = (supervisorId: string | null): OrgNode[] => {
          return allEmployees
            .filter((emp) => emp.supervisorId === supervisorId)
            .map((emp) => ({
              employee: emp,
              children: buildTree(emp.id),
              expanded: true,
            }))
        }

        // Start with the supervisors (they might report to someone outside the chart)
        const supervisors = allEmployees.filter((emp) => report.supervisors.includes(emp.id))

        const rootNodes: OrgNode[] = supervisors.map((supervisor) => ({
          employee: supervisor,
          children: buildTree(supervisor.id),
          expanded: true,
        }))

        setOrgData(rootNodes)
      } catch (error) {
        console.error("Error building org chart:", error)
      } finally {
        setLoading(false)
      }
    }

    buildOrgChart()
  }, [report])

  const toggleNode = (node: OrgNode) => {
    node.expanded = !node.expanded
    setOrgData([...orgData])
  }

  const renderNode = (node: OrgNode, level = 0) => {
    const isMapped = isEmployeeMappedToReport(node.employee.id, report.name)
    const isSupervisor = report.supervisors.includes(node.employee.id)

    return (
      <div key={node.employee.id} className="org-node">
        <div
          className={cn(
            "flex items-center p-2 my-1 rounded-md transition-colors",
            isSupervisor
              ? "bg-blue-100 border border-blue-200"
              : isMapped
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200",
            level > 0 && "ml-6",
          )}
          style={{ marginLeft: `${level * 1.5}rem` }}
        >
          {node.children.length > 0 && (
            <button onClick={() => toggleNode(node)} className="mr-2 p-1 rounded-full hover:bg-muted/50">
              {node.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          )}

          <div className="flex items-center">
            {isSupervisor ? (
              <Users className="h-5 w-5 mr-2 text-blue-600" />
            ) : (
              <User className="h-5 w-5 mr-2 text-gray-600" />
            )}
            <div>
              <div className="font-medium">
                <EmployeeDetailsDialog
                  employeeId={node.employee.id}
                  trigger={
                    <Button variant="link" className="p-0 h-auto font-medium">
                      {node.employee.name}
                    </Button>
                  }
                />
              </div>
              <div className="text-xs text-muted-foreground">{node.employee.title}</div>
            </div>
          </div>
        </div>

        {node.expanded && node.children.map((child) => renderNode(child, level + 1))}
      </div>
    )
  }

  if (loading) {
    return <div className="py-4 text-center text-muted-foreground">Loading organization chart...</div>
  }

  if (orgData.length === 0) {
    return <div className="py-4 text-center text-muted-foreground">No organization data available for this report.</div>
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        <span className="inline-block w-3 h-3 bg-blue-100 border border-blue-200 rounded-sm mr-1"></span> Supervisor
        <span className="inline-block w-3 h-3 bg-green-50 border border-green-200 rounded-sm ml-4 mr-1"></span> Mapped
        <span className="inline-block w-3 h-3 bg-red-50 border border-red-200 rounded-sm ml-4 mr-1"></span> Not Mapped
      </div>

      <div className="org-chart border rounded-md p-4 overflow-x-auto">{orgData.map((node) => renderNode(node))}</div>
    </div>
  )
}
