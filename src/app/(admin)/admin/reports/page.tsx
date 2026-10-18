import { PageHeader } from "@/components/shared/PageHeader";
import { ReportsClient } from "./ReportClient";

export default function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Library Reports"
        description="Generate reports and export data"
      />
      <ReportsClient />
    </div>
  );
}