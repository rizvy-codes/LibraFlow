import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) redirect("/login");

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Update your personal information"
      />
      <ProfileForm
        user={{
          name: user.name,
          email: user.email,
          studentId: user.studentId || "",
          department: user.department || "",
          semester: user.semester || "",
          phone: user.phone || "",
        }}
      />
    </div>
  );
}