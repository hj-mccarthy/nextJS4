import { ExportButton } from "@/components/export-button"
import ReportDashboardWrapper from "@/components/report-dashboard-wrapper"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold">Report Mapping Dashboard</h1>
          <div className="mt-4 sm:mt-0">
            <ExportButton />
          </div>
        </div>
        <ReportDashboardWrapper />
      </div>
    </main>
  )
}
