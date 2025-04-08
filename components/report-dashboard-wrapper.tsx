"use client"

import { Suspense } from "react"
import ReportDashboard from "@/components/report-dashboard"

export default function ReportDashboardWrapper() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8">Loading dashboard...</div>}>
      <ReportDashboard />
    </Suspense>
  )
}
