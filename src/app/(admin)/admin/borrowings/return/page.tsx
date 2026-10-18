import { PageHeader } from "@/components/shared/PageHeader";
import { ReturnBookForm } from "./ReturnBookForm";

export default function ReturnBookPage() {
  return (
    <div>
      <PageHeader
        title="Process Return"
        description="Mark a borrowed book as returned"
      />
      <ReturnBookForm />
    </div>
  );
}