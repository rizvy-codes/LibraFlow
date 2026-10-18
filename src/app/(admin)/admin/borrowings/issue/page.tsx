import { PageHeader } from "@/components/shared/PageHeader";
import { IssueBookForm } from "./IssueBookForm";

export default function IssueBookPage() {
  return (
    <div>
      <PageHeader
        title="Record Borrowing"
        description="Issue a book to a student by Student ID and Book"
      />
      <IssueBookForm />
    </div>
  );
}